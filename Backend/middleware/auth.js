import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req,res,next)=>{
  
  const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith("Bearer ") ) {
     return res.status(401).json({
      success:false,
      message:"Not authorized or missing token"
     })
  }
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if(!user){
      return res.status(401).json({
        message:"user not found",
        success:false
      })
    }
    req.user = user;
    next();


  } catch (error) {
    console.log("Error in authMiddleware",error);
    return res.status(500).json({success:false,message:"Server error"});
  }


}