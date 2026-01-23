import Landlord from "../models/landlordModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

//Signup Landlord
export const signupLandlord = async (req) => {
  const body = await req.json();
  const {
    firstName,
    lastName,
    email,
    password,
    otp,
    referalCode,
    surveyInputField,
    terms,
  } = body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !terms
  ) {
    return NextResponse.json(
      { message: "Kindly fill all fields required" },
      { status: 400 },
    );
  }

  //check if landlord exists in DB
  const existingUser = await Landlord.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "Landlord already exist!! Please login" },
      { status: 400 },
    );
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

    return NextResponse.json(
      {
        message: "New Landlord created Successfully",
        user: newLandlord,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 },
    );
  }
};

export const loginLandlord = async (body) => {
  try {
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Normalize email (trim and lowercase to match signup)
    const normalizedEmail = email.trim().toLowerCase();

    const landlord = await Landlord.findOne({ email: normalizedEmail });
    if (!landlord) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 },
      );
    }

    const isMatch = await bcrypt.compare(password, landlord.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
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

    return response;
  } catch (err) {
    console.error("Login Error:", err.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

export const getLandlord = async (req) => {
  try {
    const { _id } = req.landlord;

    const landlord = await Landlord.findById(_id)
      .populate("User")
      .populate("Otp")
      .populate("LandlordKyc")
      .populate("LandlordDashboard")
      .populate("Property");

    if (!landlord) {
      return NextResponse.json(
        { message: "Landlord not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(landlord, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const getAllLandlord = async (req) => {
  try {
    const allLandlord = await Landlord.find()
      .select("-password")
      .populate("User")
      .populate("Otp")
      .populate("LandlordKyc")
      .populate("LandlordDashboard")
      .populate("Property");

    return NextResponse.json(allLandlord, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "error getting landlord" },
      { status: 500 },
    );
  }
};

export const updateLandlord = async (req) => {
  try {
    const body = await req.json();
    const { _id, firstName, lastName, email } = body;

    // only self-update or admin
    if (req.landlord && req.landlord._id !== _id && !req.admin) {
      return NextResponse.json(
        { success: false, message: "You are unauthorized" },
        { status: 403 },
      );
    }

    const landlord = await Landlord.findByIdAndUpdate(
      _id,
      { firstName, lastName, email },
      { new: true, runValidators: true },
    ).select("-password");

    if (!landlord) {
      return NextResponse.json(
        { success: false, message: "Landlord not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Landlord updated successfully",
        landlord,
      },
      { status: 200 },
    );
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
      return NextResponse.json(
        { error: "Landlord ID is required" },
        { status: 400 },
      );
    }

    const deletedLandlord = await Landlord.findByIdAndDelete(_id);

    if (!deletedLandlord) {
      return NextResponse.json(
        { error: "Landlord not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Landlord deleted successfully", landlord: deletedLandlord },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Cannot delete Landlord" },
      { status: 500 },
    );
  }
};

// ================== ARRAY UPLOAD ==================
export const arrayUpload = async (req) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    const uploads = await Promise.all(
      files.map((file) => streamUpload(file, "images")),
    );

    return NextResponse.json(
      { message: "Upload successful", uploads },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Upload failed" },
      { status: 500 },
    );
  }
};
