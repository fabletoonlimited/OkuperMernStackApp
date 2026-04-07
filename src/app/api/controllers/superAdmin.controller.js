import jwt from "jsonwebtoken"
import SuperAdmin from "../models/adminModel.js"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server.js";
import crypto from "crypto";
import Invite from "../models/inviteModel.js"
import AuditLog from "../models/auditLogModel.js";

// ================= Signup Admin =================
export const signupSuperAdmin = async (data) => {
  const { firstName, lastName, password, token } = data;

  if (!token) {
    return { status: 400, message: "Invalid invite" };
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const invite = await Invite.findOne({
    token: hashedToken,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!invite) {
    return { status: 400, message: "Invite expired or invalid" };
  }

  const inviteEmail = invite.email;

  // 🔥 Prevent multiple super admins BEFORE save
  if (invite.role === "superAdmin") {
    const existingSuperAdmin = await SuperAdmin.findOne({ role: "superAdmin" });

    if (existingSuperAdmin) {
      return { status: 403, message: "Super admin already exists" };
    }
  }

    // 🔥 Prevent duplicate email
    const existingAdmin = await SuperAdmin.findOne({
        email: inviteEmail.toLowerCase(),
    });

    if (existingAdmin) {
        return { status: 400, message: "Admin already exists" };
    }

    const allowedRoles = ["admin", "superAdmin"];
        if (!allowedRoles.includes(invite.role)) {
        return { status: 400, message: "Invalid role" };
        }
        
    // Prevent super admin (still keep, but DB index is the real protection)
    if (invite.role === "superAdmin") {
    const existingSuperAdmin = await SuperAdmin.findOne({ role: "superAdmin" });

    if (existingSuperAdmin) {
        return { status: 403, message: "Super admin already exists" };
    }
    }

  try {
    const newAdmin = new SuperAdmin({
      firstName,
      lastName,
      email: inviteEmail.trim().toLowerCase(),
      password,
      role: invite.role,
      isVerified: true,
    });

    await newAdmin.save();

    invite.used = true;
    await invite.save();

    return {
      status: 201,
      success: true,
      message: "Admin created successfully",
    };
  } catch (error) {
    if (error.code === 11000) {
      return { status: 400, message: "Admin already exists" };
    }

    return { status: 500, message: "Something went wrong" };
  }
};


// ================= Login SuperAdmin =================
export const loginSuperAdmin = async (data) => {
  try {
    const { email, password } = data;

    if (!email || !password) {
      return { status: 400, message: "Email and password are required" };
    }

    const normalizedEmail = email.trim().toLowerCase();

    const admin = await SuperAdmin.findOne({
      email: normalizedEmail,
    });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return { status: 400, message: "Invalid credentials" };
    }

    if (!admin.isVerified) {
      return { status: 403, message: "Account not verified" };
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role, // ✅ dynamic role
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    const response = NextResponse.json(
      {
        success: true,
        admin: {
          id: admin._id,
          name: `${admin.firstName} ${admin.lastName}`,
          email: admin.email,
          role: admin.role,
        },
        message: "Login successful",
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
};
    
// ================= Login Admin =================
export const loginAdmin = async (data) => {
  try {
    const { email, password } = data;

    if (!email || !password) {
      return { status: 400, message: "Email and password are required" };
    }

    const normalizedEmail = email.trim().toLowerCase();

    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return { status: 400, message: "Invalid credentials" };
    }

    if (!admin.isVerified) {
      return { status: 403, message: "Account not verified" };
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role, // ✅ dynamic role
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    const response = NextResponse.json(
      {
        success: true,
        admin: {
          id: admin._id,
          name: `${admin.firstName} ${admin.lastName}`,
          email: admin.email,
          role: admin.role,
        },
        message: "Login successful",
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
};

//======== Invite Admin =============

export const inviteAdmin = async ({ email, role, adminId }) => {
  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const invite = await Invite.create({
    email,
    role,
    token: hashedToken,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24hrs
  });

  await AuditLog.create({
    action: "INVITE_ADMIN",
    performedBy: adminId,
    metadata: { email, role },
  });

  return token; // send via email
};

export const revokeAdmin = async ({ adminId, revokedAdminId }) => {
  await SuperAdmin.findByIdAndDelete(revokedAdminId);

  await AuditLog.create({
    action: "REVOKE_ADMIN",
    performedBy: adminId,
    targetId: revokedAdminId,
  });

  return { success: true };
};

