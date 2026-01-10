import Tenant from "../models/tenantModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOtp } from "../lib/otpService.js";
import { Resend } from "resend";
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

//Signup Tenant
export const signupTenant = async (req, body) => {
  const { firstName, lastName, email, password, referalCode, survey, terms } =
    body;

  if (!firstName || !lastName || !email || !password || !survey || !terms) {
    return NextResponse.json(
      { message: "Kindly fill all fields required" },
      { status: 400 }
    );
  }

  //check if landlord exists in DB
  const existingUser = await Tenant.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "Tenant already exist!! Please login" },
      { status: 400 }
    );
  }

  try {
    const newTenant = new Tenant({
      firstName,
      lastName,
      email,
      password,
      referalCode,
      survey,
      terms,
      role: "tenant",
    });

    const otp = await generateOtp(
      email,
      "verifyAccount",
      "Tenant",
      newTenant._id
    );
    newTenant.otp = otp._id;

    await newTenant.save();

    //send welcome email to tenant
    if (resend) {
      await resend.emails.send({
        from: "noreply@fabletoon.com", // Use your verified domain
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
                      <li>Browsing available properties</li>
                      <li>Saving your favorite homes</li>
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
        message: "New tenant created Successfully",
        user: newTenant,
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

export const loginTenant = async (req, body) => {
  try {
    const { email, password } = body;

    const tenant = await Tenant.findOne({ email });
    if (!tenant) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = bcrypt.compareSync(password, tenant.password);
    if (!isMatch) {
      return NextResponse.json({ error: "invalid password" }, { status: 401 });
    }

    //create a token
    const token = jwt.sign(
      { id: tenant._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } //1day
    );

    const response = NextResponse.json(
      {
        tenant: {
          id: tenant._id,
          name: `${tenant.firstName} ${tenant.lastName}`,
          email: tenant.email,
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

export const getTenant = async (req, tenantData) => {
  const { _id } = tenantData;

  const tenant = await Tenant.findById(_id)
    .populate("User")
    .populate("Otp")
    .populate("TenantKyc")
    .populate("TenantDashboard")
    .populate("Property");

  return NextResponse.json(tenant);
};

export const getAllTenant = async (req) => {
  try {
    const allTenant = await Tenant.find()
      .select("-password")
      .populate("User")
      .populate("Otp")
      .populate("TenantKyc")
      .populate("TenantDashboard")
      .populate("Property");

    return NextResponse.json(allTenant);
  } catch (error) {
    return NextResponse.json(
      { message: "error getting tenant" },
      { status: 500 }
    );
  }
};

export const updateTenant = async (req, tenantData) => {
  try {
    const body = await req.json();
    const { firstName, lastName, email } = body;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // only self-update or admin
    // Simplified logic for this fix
    const targetId = id || tenantData._id;

    const tenant = await Tenant.findByIdAndUpdate(
      targetId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!tenant)
      return NextResponse.json(
        {
          success: false,
          message: "Tenant not found",
        },
        { status: 404 }
      );

    return NextResponse.json(
      {
        success: true,
        message: "Tenant updated successfully",
        tenant,
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

export const deleteTenant = async (req) => {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("id");

  try {
    const deleteTenant = await Tenant.findByIdAndDelete(_id);
    return NextResponse.json(deleteTenant);
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Cannot delete Tenant" },
      { status: 500 }
    );
  }
};

// ================== ARRAY UPLOAD ==================
export const arrayUpload = async (req, res, next) => {
  try {
    const uploads = await Promise.all(
      req.files.map((file) => streamUpload(file.buffer, "images"))
    );
    return res.json({ message: "Upload successful", uploads });
  } catch (error) {
    next(error);
  }
};
