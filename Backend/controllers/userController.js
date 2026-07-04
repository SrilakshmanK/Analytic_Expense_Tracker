import bcrypt from "bcryptjs";
import validator from "validator";

import { User } from "../models/userModel.js";
import { createToken } from "../utils/tokenGenerater.js";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!email || !name || !password) {
      return res.status(400).json({
        message: "All fields Required",
        success: false,
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid Email",
        success: false,
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be atleast 8 characters .",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists.",
        error: true,
        success: false,
      });
    }

    const hasedPwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hasedPwd,
    });

    const token = await createToken(user._id);
    const { password:_, ...userData } = user.toObject();

    res.status(201).json({
      message: "User created successfully . ",
      success: true,
      error: false,
      token,
      user: userData,
    });
  } catch (error) {
    console.log("Error in Signup function : ", error);

    return res.status(500).json({
      message: "Internal Server error on signUP",
      error: true,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields required ",
      success: false,
    }); 
  }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          message: "Invalid Mail or Password",
          success: false,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({
          message: "Invalid Mail or Password",
          success: false,
        });
      }

      const token = await createToken(user._id);
      const { password:_, ...userData } = user.toObject();

      res.status(200).json({
        success: true,
        message: "User logged In ",
        token,
        user: userData,
      });
    } catch (error) {
      console.log("Error in Login function : ", error);

      return res.status(500).json({
        message: "Internal Server error",
        error: true,
        success: false,
      });
    }
  
};

// get Current user

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in Get Current User  function : ", error);

    return res.status(500).json({
      message: "Internal Server error",
      error: true,
      success: false,
    });
  }
};

// to update user profile

export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email || !validator.isEmail(email)) {
    return res.status(400).json({
      message: "Valid Email and Name required .",
      success: false,
    });
  }

  try {
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) {
      return res.status(409).json({
        message: "Email already in use",
        success: false,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "email name" },
    );
    
    res.status(200).json({
      message:"User updated successfully.",
      success:true,
      user
  })




  } catch (error) {
    console.log("Error in  Update User  function : ", error);

    return res.status(500).json({
      message: "Internal Server error",
      error: true,
      success: false,
    });
  }
};

// to change user password 

export const updatePassword = async (req, res) => {
  
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword ) {
    return res.status(400).json({
      message:"Invalid Password or Too short ",
      success:false
    })
  }
  if (newPassword.length < 8) {
  return res.status(400).json({
    message: "New password must be at least 8 characters.",
    success: false,
  });
}

  try {
    
    const user = await User.findById(req.user.id).select("password");

    if(!user){
      return res.status(404).json({
        message : "User not found",
        success:false
      });
    }

    const match = await bcrypt.compare(currentPassword, user.password)

    if(!match){
      return res.status(401).json({
        message:"Current password is Incorrect .",
        success:false
      })
    }

   user.password = await bcrypt.hash(newPassword,10)
   await user.save();

    
    return res.status(200).json({
      message:"Password Updated Successfully .",
      success:true,
      error:false
    })

  } catch (error) {
    console.log("Error in  Update Password  function : ", error);

    return res.status(500).json({
      message: "Internal Server error",
      error: true,
      success: false,
    });
  }
    

};