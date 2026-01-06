import jwt from "jsonwebtoken";
import User from "../models/userModel.js"
import Landlord from "../models/landlordModel.js";
import Tenant from "../models/tenantModel.js";
import Otp from "../models/otpModel.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

//Create User
export const createUser = async (req, res) => {
    const {residencyStatus, whoIsUsingPlatform, role} = req.body;

    if (!residencyStatus || !whoIsUsingPlatform || !role) {
        return res.status(400).json({message: "Kindly select all fields required"})
    }

    //check if user exists in DB
    const existingUser = await User.findOne({residencyStatus, whoIsUsingPlatform, role});
    if (existingUser) {
        return res.status(400).json({message: "User already exist!!"})
    }
    try {
        const newUser = new User({
        residencyStatus, 
        whoIsUsingPlatform, 
        role
    }); 
    
    await newUser.save();
    return res.status(201).json({
        message: "New User created Successfully",
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

//login Landlord or Tenant
export const loginUser = async (req, res) => {
    const {firstName, LastName, Password, confirmPassword, surveyInputField, terms} = req.body;

    if (!firstName || !LastName || !Password || !confirmPassword || surveyInputField || !terms) {
        return res.status(400).json({message: "Kindly fill all fields required"})
    }

    //check if user exists in DB
    const user = await User.findOne({firstName, LastName, Password, confirmPassword, surveyInputField, terms});
    if (!user) {
        return res.status(404).json({message: "User not found. Please signup"})
    }

    //Generate JWT token
    const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
        message: "User logged in successfully",
        user,
        token,
    });
};

//create Otp
export const createOtp = async (req, res) => {
    const {email, otp} = req.body;

    if (!email || !otp) {
        return res.status(400).json({message: "Kindly provide email and otp"})
    }

    try {
        const newOtp = new Otp({
            email,
            otp
        });

        await newOtp.save();
        return res.status(201).json({
            message: "New OTP created Successfully",
            otp: newOtp
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

