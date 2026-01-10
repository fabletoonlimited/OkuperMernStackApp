import Otp from "@/app/api/models/otpModel.js";
import Landlord from "@/app/models/landlordModel.js";
import Tenant from "@/app/models/tenantModel.js";
import { Resend } from "resend";


//1====================CreateOTP=========================//
const resend = new Resend(process.env.RESEND_API_KEY);

export async function createOtpController (data) {
  const { email } = data;

  if (!email) {
    throw new Error ( "Email required" );
  }

 //Existing Email
    const existingTenant = await Tenant.findOne({email});
    const Landlord = await Landlord.findOne({email});

    if (existingTenant || existingLandlord) {
      return {
        exists: "true",
        message: "Email already exists",
      };
    }

    //Remove previous OTP for this email
    await Otp.deleteMany({ email });

    // Generate random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const newOtp = new Otp({
      email,
      otp: otpCode,
      expiresAt,
    });

    await newOtp.save();

  // Send OTP via Resend
    const { error } = await resend.emails.send({
      from: process.env.SEND_OTP_FROM, 
      to: email,
      subject: "Your OTP Code",
      html: 
        `
        <p>Your OTP code is <strong>${otpCode}</strong>.<p>
        <p>It expires in 5 minutes.<p>
        <p>Warm Regards, <br/>Okuper Technologies Limited</p>
        `
      });

    if (error) {
     throw new Error("Resend send email error")
    }

    return {
      success: true,
      message: "OTP sent successfully"
    };
  };


//2====================VerifyOTP=========================//
export async function verifyOtpController(data) {
  const { email, otp } = data;

  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    throw new Error("Invalid or expired OTP");
  }

  // Optional expiry check
  if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new Error("OTP has expired");
  }

  // OTP is valid → delete it
  await Otp.deleteOne({ _id: otpRecord._id });

  // Return verified data
  return {
    success: true,
    email,
  };
}


