// import jwt from "jsonwebtoken";
import User from "../models/userModel.js"
// import Otp from "../models/otpModel.js";
// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY)

//Create User
export async function createUserController (data) {
    const {residencyStatus, whoIsUsingPlatform, role} = data;

    if (!residencyStatus || !whoIsUsingPlatform || !role) {
        throw new Error("Kindly select all fields required");
    }

    //check if user exists in DB
    const existingUser = await User.findOne({
        residencyStatus, 
        whoIsUsingPlatform, 
        role
    });

    if (existingUser) {
        throw new Error("User already exist!!")
    }
    
    const newUser = await User.create({
        residencyStatus, 
        whoIsUsingPlatform, 
        role
    }); 
    
    return {
        message: "New User created Successfully",
        user: newUser,
    };
};

//Get one User
export async function getUserController (_id) {
    if (!_id) {
        throw new Error("User ID is required");
    }
    const user = await User.findById(_id)
    .populate("tenant")
    .populate("landlord")
    .populate("otp")

    if (!user) {
        throw new Error("User not found");
    }
    return user;
};


//Get all user
export async function getAllUserController () {
    const getAllUser = await User.find()
        .populate("tenant")
        .populate("landlord")
        .populate("otp")

        return {
            message: "All user successfully pulled",
            success: true,
            user: getAllUser
        };
};

export async function deleteUserController (_id) {
        if (!_id) {
        throw new Error("User ID is required");
    }
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
        throw new Error("User not found");
    };

    return { 
        success: true, 
        message: "User deleted successfully from DB" 
    };
};

// //login Landlord or Tenant
// export async function loginUserController (data) {
//     const {firstName, LastName, Password, confirmPassword, surveyInputField, terms} = req.body;

//     if (!firstName || !LastName || !Password || !confirmPassword || surveyInputField || !terms) {
//         return NextResponse.json({message: "Kindly fill all fields required"})
//     }

//     //check if user exists in DB
//     const user = await User.findOne({firstName, LastName, Password, confirmPassword, surveyInputField, terms});
//     if (!user) {
//         return NextResponse.json({message: "User not found. Please signup"})
//     }

//     //Generate JWT token
//     const token = jwt.sign(
//         { _id: user._id, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//     );

//     NextResponse.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     return NextResponse.status(200).json({
//         message: "User logged in successfully",
//         user,
//         token,
//     });
// };

//create Otp
// export const createOtp = async (req, res) => {
//     const {email, otp} = req.body;

//     if (!email || !otp) {
//         return NextResponse.json({message: "Kindly provide email and otp"})
//     }

//     try {
//         const newOtp = new Otp({
//             email,
//             otp
//         });

//         await newOtp.save();
//         return NextResponse.json({
//             message: "New OTP created Successfully",
//             otp: newOtp
//         });

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ message: "Something went wrong", error: error.message });
//     }
// };

