import Tenant from "../models/tenantModel.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//Signup Tenant
export const signupTenant = async (req) => {
  const body = await req.json();
  const { 
    firstName,
    lastName,
    email,
    password,
    otp,
    referalCode,
    surveyInputField,
    terms 
  } = body;

  if (
    !firstName || !lastName || !email || !password || !surveyInputField || !terms
  ) {
    return NextResponse.json(
      { message: "Kindly fill all fields required" },
      { status: 400 }
    );
  }

  //check if tenant exists in DB
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
      otp,
      referalCode,
      survey: surveyInputField,
      terms,
      role: "tenant",
    });

    await newTenant.save();

    //send welcome email to tenant
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
        message: "New Tenant created Successfully",
        user: newTenant,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
};

export const loginTenant = async (req) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    const tenant = await Tenant.findOne({ email });
    if (!tenant) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, tenant.password);
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

export const getTenant = async (req) => {
  try{
    const { _id } = req.tenant;

    const tenant = await Tenant.findById(_id)
      .populate("User")
      .populate("Otp")
      .populate("TenantKyc")
      .populate("TenantDashboard")
      .populate("Property");

      if (!tenant) {
        return NextResponse.json(
          { message: "Tenant not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(tenant, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  };
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

    return NextResponse.json(allTenant, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "error getting tenant" },
      { status: 500 }
    );
  }
};

export const updateTenant = async (req) => {
  try {
    const body = await req.json();
    const { _id, firstName, lastName, email } = body;
    // const { searchParams } = new URL(req.url);
    // const id = searchParams.get("id");

    // only self-update or admin
    if (req.tenant && req.tenant._id !== _id && !req.admin) {
      return NextResponse.json(
        { success: false, message: "You are unauthorized" },
        { status: 403 }
      );
    }

    const tenant = await Tenant.findByIdAndUpdate(
      _id,
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
      { message: "something went wrong", error: error.message },
      { status: 500 }
    );
  }
};

export const deleteTenant = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("id");

    if (!_id) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 },
      );
    };

    const deletedTenant = await Tenant.findByIdAndDelete(_id);

    if (!deletedTenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    };

    return NextResponse.json(
      { message: "Tenant deleted successfully", tenant: deletedTenant },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Cannot delete Tenant" },
      { status: 500 }
    );
  };
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
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Upload failed" },
      { status: 500 }
    );
  };
};
