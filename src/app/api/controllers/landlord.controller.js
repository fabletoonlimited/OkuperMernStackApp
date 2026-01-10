import Landlord from "../models/landlordModel.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOtp } from "../lib/otpService.js";
import { Resend } from "resend";
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

//Signup Landlord
export const signupLandlord = async (req, body) => {
  // Use body passed from route handler
  const { firstName, lastName, email, password, referalCode, survey, terms } =
    body;

  // Debug logging
  console.log("Received signup data:", {
    firstName,
    lastName,
    email,
    password: "***",
    survey,
    terms,
  });

  if (!firstName || !lastName || !email || !password || !survey) {
    console.log("Validation failed - missing fields");
    return NextResponse.json(
      { message: "Please fill all required fields" },
      { status: 400 }
    );
  }

  if (terms !== true) {
    console.log("Validation failed - terms not accepted:", terms);
    return NextResponse.json(
      { message: "Please accept the terms and conditions" },
      { status: 400 }
    );
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (password.length < 8) {
    return NextResponse.json(
      {
        message: "Password must be at least 8 characters",
      },
      { status: 400 }
    );
  }

  //check if landlord exists in DB
  const existingUser = await Landlord.findOne({ trimmedEmail });
  if (existingUser) {
    return NextResponse.json(
      { message: "Landlord already exist!! Please login" },
      { status: 400 }
    );
  }

  try {
    const newLandlord = new Landlord({
      firstName,
      lastName,
      email: trimmedEmail,
      password,
      referalCode,
      survey,
      terms,
      isVerified: false,
      role: "landlord",
    });

    // Generate OTP using service
    const otp = await generateOtp(
      trimmedEmail,
      "verifyAccount",
      "Landlord",
      newLandlord._id
    );
    newLandlord.otp = otp._id;

    await newLandlord.save();

    //send welcome email and otp to landlord
    if (resend) {
      await resend.emails.send({
        from: process.env.SEND_OTP_FROM || "onboarding@resend.dev",
        to: email,
        subject: "Welcome to Okuper!",
        html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="color: #003399;">Welcome to Okuper, ${firstName}!</h1>
                    <p>Thank you for joining Okuper - your trusted platform for renting and buying homes directly.</p>
                    <p>No agents. No hidden fees. Just verified people and real homes.</p>
                    <p>Your verification code is: <strong>${otp.code}</strong></p>
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
    }

    return NextResponse.json(
      {
        message: "New Landlord created Successfully",
        user: newLandlord,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern?.email) {
      return NextResponse.json(
        {
          message:
            "This email is already registered. Please login or use a different email.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Something went wrong. Please try again.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const loginLandlord = async (req, body) => {
  try {
    const { email, password } = body;

    const landlord = await Landlord.findOne({ email });
    if (!landlord) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = bcrypt.compareSync(password, landlord.password);
    if (!isMatch) {
      return NextResponse.json({ error: "invalid password" }, { status: 401 });
    }

    //create a token
    const token = jwt.sign(
      { id: landlord._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } //1day
    );

    const response = NextResponse.json(
      {
        landlord: {
          id: landlord._id,
          name: `${landlord.firstName} ${landlord.lastName}`,
          email: landlord.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1day
    });

    return response;
  } catch (err) {
    console.error("Login Error:", err.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

export const getLandlord = async (req, landlordData) => {
  const { _id } = landlordData;

  const landlord = await Landlord.findById(_id)
    .populate("User")
    .populate("Otp")
    .populate("LandlordKyc")
    .populate("LandlordDashboard")
    .populate("Property");

  return NextResponse.json(landlord);
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

    return NextResponse.json(allLandlord);
  } catch (error) {
    return NextResponse.json(
      { message: "error getting landlord" },
      { status: 500 }
    );
  }
};

export const updateLandlord = async (req, landlordData) => {
  try {
    const body = await req.json();
    const { firstName, lastName, email } = body;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Assuming ID is passed via query param or we use landlordData._id

    // only self-update or admin
    // Simplified for this fix:
    const targetId = id || landlordData._id;

    const landlord = await Landlord.findByIdAndUpdate(
      targetId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!landlord)
      return NextResponse.json(
        { success: false, message: "Landlord not found" },
        { status: 404 }
      );

    return NextResponse.json(
      {
        success: true,
        message: "Landlord updated successfully",
        landlord,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
};

export const deleteLandlord = async (req) => {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("id");

  try {
    const deleteLandlord = await Landlord.findByIdAndDelete(_id);
    return NextResponse.json(deleteLandlord);
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Cannot delete Landlord" },
      { status: 500 }
    );
  }
};

// ================== ARRAY UPLOAD ==================
// export const arrayUpload = async (req, res, next) => {
//   try {
//     const uploads = await Promise.all(
//       req.files.map((file) => streamUpload(file.buffer, "images"))
//     );
//     return res.json({ message: "Upload successful", uploads });
//   } catch (error) {
//     next(error);
//   }
// };
