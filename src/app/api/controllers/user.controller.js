import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Landlord from "../models/landlordModel.js";
import Tenant from "../models/tenantModel.js";
import Otp from "../models/otpModel.js";
import { Resend } from "resend";
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

//Create User
export const createUser = async (req) => {
  try {
    const body = await req.json();
    const { residencyStatus, whoIsUsingPlatform, role } = body;

    if (!residencyStatus || !whoIsUsingPlatform || !role) {
      return NextResponse.json(
        { message: "Kindly select all fields required" },
        { status: 400 }
      );
    }

    //check if user exists in DB
    const existingUser = await User.findOne({
      residencyStatus,
      whoIsUsingPlatform,
      role,
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exist!!" },
        { status: 400 }
      );
    }

    const newUser = new User({
      residencyStatus,
      whoIsUsingPlatform,
      role,
    });

    await newUser.save();
    return NextResponse.json(
      {
        message: "New User created Successfully",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
};

//Get one User
export const getUser = async (req) => {
  // Assuming auth middleware attaches user to req, but for now handling generic
  // You might need to parse ID from params or auth header
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("id");

  const user = await User.findById(_id)
    .populate("tenant")
    .populate("landlord")
    .populate("otp");

  return NextResponse.json(user);
};

//Get all users
export const getAllUsers = async (req) => {
  try {
    const getAllUsers = await User.find()
      .populate("tenant")
      .populate("landlord")
      .populate("otp");

    return NextResponse.json(
      {
        message: "All users successfully pulled",
        success: true,
        users: getAllUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
};

export const deleteUser = async (req) => {
  try {
    // Add auth check here if needed
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully by Admin from DB",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

//login Landlord or Tenant
export const loginUser = async (req) => {
  const body = await req.json();
  const {
    firstName,
    LastName,
    Password,
    confirmPassword,
    surveyInputField,
    terms,
  } = body;

  if (
    !firstName ||
    !LastName ||
    !Password ||
    !confirmPassword ||
    surveyInputField ||
    !terms
  ) {
    return NextResponse.json(
      { message: "Kindly fill all fields required" },
      { status: 400 }
    );
  }

  //check if user exists in DB
  const user = await User.findOne({
    firstName,
    LastName,
    Password,
    confirmPassword,
    surveyInputField,
    terms,
  });
  if (!user) {
    return NextResponse.json(
      { message: "User not found. Please signup" },
      { status: 404 }
    );
  }

  //Generate JWT token
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json(
    {
      message: "User logged in successfully",
      user,
      token,
    },
    { status: 200 }
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return response;
};

//create Otp
export const createOtp = async (req) => {
  const body = await req.json();
  const { email, otp } = body;

  if (!email || !otp) {
    return NextResponse.json(
      { message: "Kindly provide email and otp" },
      { status: 400 }
    );
  }

  try {
    const newOtp = new Otp({
      email,
      otp,
    });

    await newOtp.save();
    return NextResponse.json(
      {
        message: "New OTP created Successfully",
        otp: newOtp,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
};
