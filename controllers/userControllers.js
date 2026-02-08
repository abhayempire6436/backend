import userModel from "../models/userModel.js";
import validator from 'validator'
// import bcrypt from 'bcrypt'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'


const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// User Login
const loginUser = async (req, res) => {

    try {
        const {email, password} = req.body;

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "User does not exists"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id);
            res.json({success: true, token})
        }
        else{
            res.json({success: false, message: "Invalid Password"});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }

}

// User Register
const registerUser = async (req, res) => {
    // res.json({msg: "Register API working"})
    try {
        
        const {name, email, password} = req.body;

        // checking if user already exists
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success: false, message: "User already exists"});
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Invalid email format"})
        }
        if(password.length < 8){
            return res.json({success: false, message: "Please enter strong password"})
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save();

        const token = createToken(user._id)

        res.json({success: true, token})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
}

// Admin Login
const adminLogin = async (req, res) => {

    try {
        
        const {email, password} = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success: true, token})
        }
        else{
            return res.json({success: false, message: "Invalid email or password"});
        }

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export { loginUser, registerUser, adminLogin };