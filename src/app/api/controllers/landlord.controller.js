import Landlord from "../models/landlordModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

//Signup Landlord
export const signupLandlord = async (data) => {
  const {
    firstName,
    lastName,
    email,
    password,
    otp,
    referalCode,
    surveyInputField,
    terms,
    isSubscribed,
    isVerified,
  } = data;

  if (
    !firstName || !lastName || !email || !password || !terms) {
    throw new Error ("Kindly fill all fields required");
  }

  //check if landlord exists in DB
  const existingUser = await Landlord.findOne({ email });
  if (existingUser) {
    throw new Error("Landlord already exist!! Please login");
  }

  try {
    const newLandlord = new Landlord({
      firstName,
      lastName,
      email,
      password,
      otp,
      referalCode,
      survey: surveyInputField,
      terms,
      referralCode,
      isSubscribed,
      isVerified,
      role: "Landlord",
    });

    await newLandlord.save();

    //send welcome email to landlord
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.SEND_OTP_FROM || "noreply@okuper.com",
        to: email,
        subject: "Welcome to Okuper!",
        html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="color: #003399;">Welcome to Okuper, ${firstName}!</h1>
                    <p>Thank you for joining Okuper - your trusted platform for renting and buying homes directly.</p>
                    <p>No agents. No hidden fees. Just verified people and real homes.</p>
                    <br/>
                    <p>Get started by:</p>
                    <ul>
                      <li>Completing your profile</li>
                      <li>Listing your properties</li>
                      <li>Managing tenant inquiries</li>
                    </ul>
                    <br/>
                    <p>If you have any questions, feel free to contact our support team.</p>
                    <br/>
                    <p>Best regards,<br/>The Okuper Team</p>
                  </div>
                `,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return(
      {
        success: true,
        message: "New Landlord created Successfully",
        user: newLandlord,
      }
    );
    
  } catch (error) {
    console.error(error);
    throw new Error ("Something went wrong"
    );
  }
};

export const loginLandlord = async (data) => {
  try {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error ("Email and password are required" );
    }

    // Normalize email (trim and lowercase to match signup)
    const normalizedEmail = email.trim().toLowerCase();

    const landlord = await Landlord.findOne({ email: normalizedEmail });

    const isMatch = await bcrypt.compare(password, landlord.password);
    if (!isMatch) {
      throw new Error ("Invalid password");
    }

    //create a token
    const token = jwt.sign(
      { id: landlord._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, //1day
    );

    const response = NextResponse.json(
      {
        success: true,
        landlord: {
          id: landlord._id,
          name: `${landlord.firstName} ${landlord.lastName}`,
          email: landlord.email,
        },
        message: "Login successful",
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path:"/",
      maxAge: 24 * 60 * 60 * 1000, // 1day
    });
     
  if (!normalizedEmail || !landlord) {
    throw new Error ("landlord not found with this email" );
  }  
    return response;

  } catch (err) {
    console.error("Login Error:", err.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

export const getLandlord = async (data) => {
  try {
    const { _id } = data.landlord;

    const landlord = await Landlord.findById(_id)
      .populate("User")
      .populate("Otp")
      .populate("LandlordKyc")
      .populate("LandlordDashboard")
      .populate("Property");

    if (!landlord) {
      throw new Error ( "Landlord not found");
    }
    return {
      success: true, 
      landlord
    };
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const getAllLandlord = async (data) => {
  try {
    const allLandlord = await Landlord.find()
      .select("-password")
      .populate("User")
      .populate("Otp")
      .populate("LandlordKyc")
      .populate("LandlordDashboard")
      .populate("Property");

    return {
      success: true, 
      allLandlord};
  } catch (error) {
    return NextResponse.json(
      { message: "error getting landlord" },
      { status: 500 },
    );
  }
};

export const updateLandlord = async (data) => {
  try {
    const body = await data.json();
    const { _id, firstName, lastName, email } = body;

    // only self-update or admin
    if (data.landlord && req.landlord._id !== _id && !req.admin) {
     throw new Error("You are unauthorized");
    }

    const landlord = await Landlord.findByIdAndUpdate(
      _id,
      { firstName, lastName, email },
      { new: true, runValidators: true },
    ).select("-password");

    if (!landlord) {
      throw new Error("Landlord not found" );
    }

    return({
        success: true,
        message: "Landlord updated successfully",
        landlord,
      });
  } catch (error) {
    return NextResponse.json(
      { message: "something went wrong", error: error.message },
      { status: 500 },
    );
  }
};

export const deleteLandlord = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      throw new Error("Landlord ID is required");
    }

    const deletedLandlord = await Landlord.findByIdAndDelete(_id);

    if (!deletedLandlord) {
     throw new Error ("Landlord not found");
    }

    return (
      { message: "Landlord deleted successfully", 
        landlord: deletedLandlord 
      }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Cannot delete Landlord" },
    );
  }
};

// ================== ARRAY UPLOAD ==================
export const arrayUpload = async (data) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    const uploads = await Promise.all(
      files.map((file) => streamUpload(file, "images")),
    );

    return (
      { 
        success: true,
        message: "Upload successful", 
        uploads 
      }
    )
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Upload failed" },
      { status: 500 },
    );
  }
};
