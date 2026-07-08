import { Income } from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

export const addIncome = async (req, res) => {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newIncome = await Income.create({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    return res.status(201).json({
      success: true,
      message: "Income added successfully",
    });
  } catch (error) {
    console.log("Error in addIncome function : ", error);

    return res.status(500).json({
      message: "Internal Server error ",
      error: true,
      success: false,
    });
  }
};

// to get all income
export const getAllIncome = async (req, res) => {
  const userId = req.user._id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    return res.status(200).json({
      success: true,
      count: income.length,
      income,
    });
  } catch (error) {
    console.log("Error in getIncome function : ", error);

    return res.status(500).json({
      message: "Internal Server error ",
      error: true,
      success: false,
    });
  }
};

// to update an income

export const updateIncome = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;

  try {
    const updateIncome = await Income.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );

    if(!updateIncome){
      return res.status(404).json({
        success:false,
        message:"Income not found"
      });
    }

    return res.status(200).json({
      success:false,
      message:"Income updated successfully .",
      data : updateIncome
    })
  } catch (error) {
    console.log("Error in updateIncome function : ", error);

    return res.status(500).json({
      message: "Internal Server error ",
      error: true,
      success: false,
    });
  }
};


// to delete an income 
export const deleteIncome = async (req,res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if(!income){
      return res.status(404).json({
        success:false,
        message:"Income not found"
      });
    }

    return res.status(200).json({
      success:true,
      message:"Income deleted successfully ."
    })
  } catch (error) {

  console.log("Error in deleteIncome function : ", error);

    return res.status(500).json({
      message: "Internal Server error ",
      error: true,
      success: false,
    });  
  }
}

export const downloadIncomeExcel = async (req, res)=>{
  const userId = req.user._id;
  try {
    const income = await Income.find({userId}).sort({date:-1});
    const plainData = income.map((inc)=>({
      Description : inc.description,
      Amount : inc.amount,
      Category : inc.category,
      Date : new Date(inc.date).toLocaleDateString()
    }));


  } catch (error) {
    
  }
}