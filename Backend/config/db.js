import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async() =>{
  
try {
  const conn = await mongoose.connect(process.env.MONGO_URI)
  console.log(`Mongo DB connected Successfully : ${conn.connection.host}`)
} catch (error) {
  console.log("Error Connecting MongoDB : ", error)
}

}