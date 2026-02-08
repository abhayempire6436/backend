import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js";

// Adding Products
const addProduct = async (req, res) =>{

    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        // console.log(name, description, price, category, subCategory, sizes, bestSeller);
        // console.log(image1, image2, image3, image4);
        
        // res.json({})

        // console.log(category, subCategory);

        const images = [image1, image2, image3, image4].filter((image)=> image !== undefined);

        let imagesURL = await Promise.all(
            images.map(async (image) => {
                let result = await cloudinary.uploader.upload(image.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestSeller: bestSeller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesURL,
            date: Date.now()
        }

        console.log(productData.description, productData.price, productData.subCategory);

        const product = new productModel(productData);
        await product.save();
        
        
        res.json({success: true, message: "Product Added Successfully"});
        
    } catch (error) {
        console.log(error);
        
        res.json({success: false, message:error.message})
    }

}

// List Products
const listProduct = async (req, res) =>{
    try {
        const products = await productModel.find({});
        res.json({success: true, products});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
    // console.log("EHllow");
    
}

// Removing Products
const removeProduct = async (req, res) =>{
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Product Removed Successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Single Products Info
const singleProduct = async (req, res) =>{

    try {
        const { productId } = req.body
        const product = await productModel.findById(productId);
        res.json({success: true, product});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export { addProduct, listProduct, removeProduct, singleProduct };