import crypto from 'crypto';
import Otp from '../models/otpModel';

// Generate otp code
export async function generateOtp(email, purpose, userType, userId = null) {
    await Otp.updateMany(
        { email, purpose, used: false },
        { used: true }
    );

    // generate random 6-digits
    const code = crypto.randomInt(100000, 1000000).toString();

    const otp = new Otp({
        code,
        email,
        purpose,
        userType,
        user: userId,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires after 5 minutes
    });

    await otp.save();
    return otp;
}

// Verify otp code
export async function verifyOtp(email, code, purpose) {
    const otp = await Otp.findOne({
        email,
        purpose,
        code,
        used: false,
        expiresAt: { $gt: new Date() }
    });

    if (!otp) return false;

    otp.used = true;
    await otp.save();

    return otp;
}