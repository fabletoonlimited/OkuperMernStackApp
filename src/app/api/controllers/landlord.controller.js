import Landlord from "../models/landlordModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Signup Landlord
export const signupLandlord = async (data) => {
  const {
    userId,
    firstName,
    lastName,
    email,
    password,
    otp,
    referralCode,
    referalCode,
    survey,
    surveyInputField,
    terms,
    isSubscribed,
    isVerified,
  } = data;

  if (!firstName || !lastName || !email || !password || !terms) {
    return { status: 400, message: "Kindly fill all fields required" };
  }

  const normalizedEmail = email.trim().toLowerCase();

  //check if landlord exists in DB
  const existingUser = await Landlord.findOne({ email: normalizedEmail });
  if (existingUser) {
    return {
      status: 400,
      message: "Landlord already exist!! Please login",
    };
  }

  try {
    const newLandlord = new Landlord({
      user: userId,
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      otp,
      referralCode: referralCode || referalCode,
      survey: survey ?? surveyInputField,
      terms,
      isSubscribed,
      isVerified,
      role: "landlord",
    });

    await newLandlord.save();

    //send welcome email to landlord
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.SEND_OTP_FROM || "noreply@okuper.com",
        to: normalizedEmail,
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

    return {
      status: 201,
      success: true,
      message: "New Landlord created Successfully",
      landlord: {
        _id: newLandlord._id,
        firstName: newLandlord.firstName,
        lastName: newLandlord.lastName,
        email: newLandlord.email,
        isVerified: newLandlord.isVerified,
      },
    };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong" };
  }
};

export const loginLandlord = async (data) => {
  try {
    const { email, password } = data;

    if (!email || !password) {
      return { status: 400, message: "Email and password are required" };
    }

    // Normalize email (trim and lowercase to match signup)
    const normalizedEmail = email.trim().toLowerCase();

    const landlord = await Landlord.findOne({ email: normalizedEmail });

    if (!landlord) {
      return { status: 404, message: "landlord not found with this email" };
    }

    const isMatch = await bcrypt.compare(password, landlord.password);
    if (!isMatch) {
      return { status: 401, message: "Invalid password" };
    }

    //create a token
    const token = jwt.sign(
      { id: landlord._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, //1day
    );

    return {
      status: 200,
      token,
      success: true,
      landlord: {
        id: landlord._id,
        name: `${landlord.firstName} ${landlord.lastName}`,
        email: landlord.email,
      },
      message: "Login successful",
    };
  } catch (err) {
    console.error("Login Error:", err.message);
    return { status: 500, message: "Server error" };
  }
};

export const getLandlord = async (data) => {
  try {
    const { id, email } = data;

    if (!id && !email) {
      return { status: 400, message: "Landlord ID or email is required" };
    }

    const query = id ? { _id: id } : { email: email.trim().toLowerCase() };

    const landlord = await Landlord.findOne(query)
      .select("-password")
      .populate("User")
      .populate("Otp")
      .populate("LandlordKyc")
      .populate("LandlordDashboard")
      .populate("Property");

    if (!landlord) {
      return { status: 404, message: "Landlord not found" };
    }

    return { status: 200, success: true, landlord };
  } catch (error) {
    return { status: 500, message: error.message || "Server error" };
  }
};

export const getAllLandlord = async () => {
  try {
    const landlords = await Landlord.find()
      .select("-password")
      .populate("User")
      .populate("Otp")
      .populate("LandlordKyc")
      .populate("LandlordDashboard")
      .populate("Property");

    return { status: 200, success: true, landlords };
  } catch (error) {
    return { status: 500, message: "error getting landlord" };
  }
};

export const updateLandlord = async (data) => {
  try {
    const { _id, email, ...updateData } = data;

    if (!_id && !email) {
      return { status: 400, message: "Landlord ID or email is required" };
    }

    const query = _id ? { _id } : { email: email.trim().toLowerCase() };
    const landlord = await Landlord.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    if (!landlord) {
      return { status: 404, message: "Landlord not found" };
    }

    return {
      status: 200,
      success: true,
      message: "Landlord updated successfully",
      landlord,
    };
  } catch (error) {
    return { status: 500, message: error.message || "Server error" };
  }
};

export const deleteLandlord = async (data) => {
  try {
    const { id } = data;

    if (!id) {
      return { status: 400, message: "Landlord ID is required" };
    }

    const deletedLandlord = await Landlord.findByIdAndDelete(id);

    if (!deletedLandlord) {
      return { status: 404, message: "Landlord not found" };
    }

    return {
      status: 200,
      success: true,
      message: "Landlord deleted successfully",
      landlord: deletedLandlord,
    };
  } catch (error) {
    console.error("Delete error:", error);
    return { status: 500, message: "Cannot delete Landlord" };
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

    return {
      success: true,
      message: "Upload successful",
      uploads,
    };
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Upload failed" },
      { status: 500 },
    );
  }
};
