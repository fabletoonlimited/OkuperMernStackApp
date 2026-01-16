import Landlord from "../models/landlordModel.js";
import User from "../models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOtp } from "@/app/lib/otpService.js";
import { generateReferralCode } from "@/app/lib/referralCodeService.js";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

  console.log("RESEND API KEY:", process.env.RESEND_API_KEY);
  console.log("RESEND INITIALIZED:", !!resend);

  console.log("RESEND LOADED", !!resend)

//Signup Landlord
export async function createLandlordController(data) {
  const { firstName, lastName, email, password, survey, terms, role, userId } = data;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("Please fill all required fields");
  }

  const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new Error("User does not exist");
    }

   if(!userId) {
    throw new Error("User is required to create landlord")
  }

  if (terms !== true) {
    throw new Error("Please accept the terms and conditions");
  }

  if (password.length < 8) {
    return { message: "Password must be at least 8 characters" };
  }

  const trimmedEmail = email.trim().toLowerCase();

 //Check if Landlord Email Exists in DB
  const existingLandlord = await Landlord.findOne({email: trimmedEmail})
    if (existingLandlord) {
      throw new Error("Landlord already exists. Please login.");
    }

  const landlordExists = await Landlord.findOne({ user: userId });
  if (landlordExists) {
    throw new Error("User already has a landlord profile");
  }

  //Create New Landlord
  const landlord = new Landlord({
    user: userId,
    firstName,
    lastName,
    email: trimmedEmail,
    password,
    survey,
    terms,
    isVerified: false,
    role: "landlord",
  });


  // ✅ Create OTP and referal code
  const [{ code: otpCode, referral }] = await Promise.all([
    generateOtp({
      email: trimmedEmail,
      action: "verifyAccount",
      userType: "Landlord",
      userId: landlord._id
    }),

    generateReferralCode({
      email: trimmedEmail,
      action: "verifiedAccount",
      userType: "Landlord",
      userId: landlord._id
    }),
  ]);
  
  await landlord.save();

  // Send email via resend
  if (!resend) throw new Error("Resend is not configured");

    await resend.emails.send({
      from: process.env.SEND_OTP_FROM,
      to: trimmedEmail,
      subject: "Welcome to Okuper!",
      html: `
        <h2>Welcome to Okuper, ${firstName}!</h2>
        <p>Your verification code is <strong>${otpCode}</strong></p>
        <p>Your referral code is <strong>${referral}</strong></p>
        <p>It expires in 5 minutes.<p><br/><br/>
        <p>Warm Regards, <br/>Okuper Technologies Limited</p>
        `,
    });

  return {
    success: true,
    landlordId: landlord._id,
  };
}

export async function loginLandlordController (data) {
  try {
    const { email, password } = data;
    const trimmedEmail = email.trim().toLowerCase();

    const landlord = await Landlord.findOne({ email: trimmedEmail });
    if (!landlord || !password) {
      throw new Error ("Invalid credentials");
    }

    const isMatch = bcrypt.compareSync(password, landlord.password);
    if (!isMatch) {
      throw new Error ("invalid password");
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
    throw new Error (error.message || "Login failed");
  }
};

export async function getLandlordController (data) {
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
};

export async function getAllLandlordController () {
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
  }
};

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


export async function deleteLandlordController (data)  {
  const _id = data;

  const deletedLandlord = await Landlord.findByIdAndDelete(_id);    if (!deletedLandlord) {
    throw new Error("Landlord not found")
  };
    
  return {
    success: true,
    message: "Landlord deleted successfully"
  };
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