import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://nandhinig:maha29@cluster0.cvrtx.mongodb.net/placement-Data").then(()=>console.log("DB connected"));
}