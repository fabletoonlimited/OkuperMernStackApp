import jwt from "jsonwebtoken";
import User from "../models/userModel.js"

export const createUser = async (req, res) => {
    const {selection1, selection2, role} = req.body;

    if (!selection1 || !selection2 || !role) {
        return res.status(400).json({message: "All fields required"})
    }

    //check if user already in DB
    const existingUser = await User.findOne({selection1, selection2,role});
    if (existingUser) {
        return res.status(400).json({message: "User already exist!!"})
    }
    try {
        const newUser = new User({
        selection1,
        selection2,
        role
    }); 
    
    await newUser.save();
    return res.status(201).json({
        message: "Record saved successfully",
        user: newUser,
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

//Get one User
export const getUser = async (req, res) => {
    const {_id} = req.user;

    const user = await User 
    .findById(_id)
    .populate("tenant")
    .populate("landlord")
    .populate("otp")

    return res.json(user);
};


//Get all users
export const getAllUsers = async (req, res) => {
    try {
        const getAllUsers = await User.find()
        .populate("tenant")
        .populate("landlord")
        .populate("otp")

        return res.status(200).json({
            message: "All users successfully pulled",
            success: true,
            users: getAllUsers
        });
    } catch (error) {
        return res.send("error")
    }
};

export const deleteUser = async (req, res) => {
  try {
    if (!req.user || !req.user.admin) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized" 
        });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({ 
        success: false, 
        message: "User not found" 
        })
    };

    return res.status(200).json({ 
        success: true, 
        message: "User deleted successfully by Admin from DB" 
    });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

