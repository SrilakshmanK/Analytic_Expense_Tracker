import bcrypt from "bcryptjs";
import validator from 'validator';

import { User } from "../models/userModel.js";
import { createToken } from "../utils/tokenGenerater.js";

export const signUp = async (req, res) => {
  const { name , email , password } = req.body;

  try {
      if (!email || !name || !password){
    return res.status(400).json({
      message: "All fields Required",
      success:false
    });
  }

  if(!validator.isEmail(email)){
    return res.status(400).json({
      message:"Invalid Email",
      success:false,
    })
  }

  if(password.length < 8){
    return res.status(400).json({
      message:"Password must be atleast 8 characters ."
    })
  }
 
  const existingUser = await User.findOne({email})

  if(existingUser){
    return res.status(409).json({
      message:"User already exists.",
      error:true,
      success:false
    })
  }

  const hasedPwd = await bcrypt.hash(password, 10);

  const user =  await User.create ({
    name,
    email,
    password:hasedPwd,
  })


 const token = createToken(user._id)
  const { password, ...userData } = user.toObject();

  res.status(201).json({
    message:"User created successfully . ",
    success:true,
    error:false,
    token,
    user:userData
  })

  } catch (error) {

    console.log("Error in Signup function : ",error)

    return res.status(500).json({
      message:"Internal Server error",
      error:true,
      success:false
    })
    
  }

}