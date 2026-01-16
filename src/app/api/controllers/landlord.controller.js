import Landlord from "../models/landlordModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOtp } from "../../lib/otpService.js";
import { generateReferralCode } from "../../lib/referralCodeService.js";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

console.log("RESEND API KEY:", process.env.RESEND_API_KEY);
console.log("RESEND INITIALIZED:", !!resend);

console.log("RESEND LOADED", !!resend);

//Signup Landlord
export async function createLandlordController(data) {
  const { firstName, lastName, email, password, survey, terms } = data;

  if (!firstName || !lastName || !email || !password || !survey) {
    throw new Error("Please fill all required fields");
  }

  if (terms !== true) {
    throw new Error("Please accept the terms and conditions");
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (password.length < 8) {
    return { message: "Password must be at least 8 characters" };
  }

  const existingLandlord = await Landlord.findOne({ email: trimmedEmail });
  if (existingLandlord) {
    return {
      exists: true,
      message: "Landlord already exists. Please login.",
    };
  }

  const newLandlord = new Landlord({
    firstName,
    lastName,
    email: trimmedEmail,
    password,
    survey,
    terms,
    isVerified: false,
    role: "landlord",
  });

  // ✅ CORRECT PARALLEL CALLS
  const [referralCode, otp] = await Promise.all([
    generateReferralCode(
      trimmedEmail,
      "verifiedAccount",
      "Landlord",
      newLandlord._id
    ),
    generateOtp(trimmedEmail, "verifyAccount", "Landlord", newLandlord._id),
  ]);

  newLandlord.referralCode = referralCode._id;
  newLandlord.otp = otp._id;

  await newLandlord.save();

  // Send email
  if (!resend) {
    throw new Error("Resend is not configured");
  }
  await resend.emails.send({
    from: process.env.SEND_OTP_FROM || "onboarding@resend.dev",
    to: trimmedEmail,
    subject: "Welcome to Okuper!",
    html: `
        <h2>Welcome to Okuper, ${firstName}!</h2>
        <p>Your verification code is <strong>${otp.code}</strong></p>
        <p>Your referral code is <strong>${referralCode.code}</strong></p>
        <p>It expires in 5 minutes.<p><br/><br/>
        <p>Warm Regards, <br/>Okuper Technologies Limited</p>
        `,
  });

  return {
    success: true,
    message: "New landlord created successfully",
    landlordId: newLandlord._id,
  };
}

export async function loginLandlordController(data) {
  try {
    const { email, password } = data;
    const trimmedEmail = email.trim().toLowerCase();

    const landlord = await Landlord.findOne({ email: trimmedEmail });
    if (!landlord || !password) {
      throw new Error("Invalid credentials");
    }

    const isMatch = bcrypt.compareSync(password, landlord.password);
    if (!isMatch) {
      throw new Error("invalid password");
    }

    //create a token
    const token = jwt.sign(
      { id: landlord._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } //1day
    );

    return {
      success: true,
      landlord: {
        id: landlord._id,
        name: `${landlord.firstName} ${landlord.lastName}`,
        email: landlord.email,
      },
      token,
    };

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1day
    });

    return response;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
}

export async function getLandlordController(data) {
  const { _id } = data;

  const landlord = await Landlord.findById(_id)
    .populate("user")
    .populate("landlordKyc")
    .populate("landlordDashboard")
    .populate("property")
    .populate("savedHomes")
    .populate("messages")
    .populate("homeInterest");

  return {
    landlord: {
      id: landlord._id,
      name: `${landlord.firstName} ${landlord.lastName}`,
      email: landlord.email,
    },
    token,
  };
}

export async function getAllLandlordController() {
  const landlords = await Landlord.find()
    .select("-password")
    .populate("user")
    .populate("landlordKyc")
    .populate("landlordDashboard")
    .populate("property")
    .populate("savedHomes")
    .populate("messages")
    .populate("homeInterest");

  return {
    message: "All landlords successfully pulled",
    success: true,
    landlord: landlords,
  };
}

export async function updateLandlordController(data) {
  const { _id, firstName, lastName, email } = data;

  const landlord = await Landlord.findByIdAndUpdate(
    _id,
    { firstName, lastName, email },
    { new: true, runValidators: true }
  ).select("-password");

  if (!landlord) {
    return {
      success: false,
      message: "Landlord not found",
    };
  }

  return {
    success: true,
    landlord,
  };
}

export async function deleteLandlordController(data) {
  const _id = data;

  const deletedLandlord = await Landlord.findByIdAndDelete(_id);
  if (!deletedLandlord) {
    throw new Error("Landlord not found");
  }

  return {
    success: true,
    message: "Landlord deleted successfully",
  };
}

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
