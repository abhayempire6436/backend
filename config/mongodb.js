import mongoose from 'mongoose';

const connectDB = async () => {

    // mongoose.connection.on('connected database', ()=>{
    //     console.log("DB Connected");
        
    // })
    await mongoose.connect(`${process.env.MONGODB_URI}`).then(()=>{
        console.log("Connected to MongoDB");
    }).catch((error)=>{
        console.log(error);       
    })
}

export default connectDB;