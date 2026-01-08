import Landlord from "../models/landlordModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


//Signup Landlord
export const signupLandlord = async (req, res) => {
    const {firstName, lastName, email, password, referalCode, surveyInputField, terms} = req.body;

    if (!firstName || !lastName || !email || !password || !surveyInputField || terms !== true) {
        return res.status(400).json({message: "Please fill all required fields and accept terms"})
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        })
    }

    //check if landlord exists in DB
    const existingUser = await Landlord.findOne({trimmedEmail});
    if (existingUser) {
        return res.status(400).json({message: "Landlord already exist!! Please login"})
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
        const newLandlord = new Landlord({
            firstName,
            lastName,
            email: trimmedEmail,
            password,
            referalCode,
            survey: surveyInputField,
            terms,
            otp: {code: otpCode, expiresAt: otpExpiry},
            isVerified: false,
            role: "landlord"
        });

        await newLandlord.save();

        //send welcome email and otp to landlord
        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev', // Use your verified domain
                to: email,
                subject: 'Welcome to Okuper!',
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
        }

        catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
        }

        return res.status(201).json({
            message: "New Landlord created Successfully",
            user: newLandlord
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const loginLandlord = async (req, res) => {
    try {
    const {email, password} = req.body;

    const landlord = await Landlord.findOne({email});
    if(!landlord) {
        return res.status(400).json({error: "Invalid credentials"})
    }

    const isMatch = bcrypt.compareSync(password, landlord.password);
    if(!isMatch) {
        return res.status(401).json({error: "invalid password"})
    };

    //create a token 
    const token = jwt.sign(
        { id:landlord._id},
        process.env.JWT_SECRET,
        { expiresIn:"1d" } //1day
    );

    res.cookie ("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 *1000 // 1day
    });

    return res.status(200).json({
        landlord: {
        id: landlord._id,
        name:`${landlord.firstName} ${landlord.lastName}`,
        email: landlord.email
        }
    });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getLandlord = async (req, res) => {
    const {_id} = req.landlord;

    const landlord = await Landlord
    .findById(_id)
    .populate("User")
    .populate("Otp")
    .populate("LandlordKyc")
    .populate("LandlordDashboard")
    .populate("Property")

    return res.json(landlord);
};

export const getAllLandlord = async (req, res) => {
    try {
        const allLandlord = await Landlord
        .find()
        .select("-password")
        .findById(_id)
        .populate("User")
        .populate("Otp")
        .populate("LandlordKyc")
        .populate("LandlordDashboard")
        .populate("Property")
        
        return res.json(allLandlord);

    } catch (error) {
        res.json({message: "error getting landlord"})
    }
};

export const updateLandlord = async (req, res) => {
    const { _id } = req.body;
    try {
        const {firstName, lastName, email} = req.body

        // only self-update or admin
        if (req.landlord._id !== req.params.id && !req.admin) {
        return res.status(403).json({ success: false, message: "You are unauthorized" });
        }
    
        const landlord = await Landlord.findByIdAndUpdate
            (req.params.id,
            { firstName, lastName, email },
            { new: true, runValidators: true })
            
            .select("-password");

            if (!landlord) 
                return res.status(404).json({ success: false, message: "Landlord not found" });

            res.status(200).json({ 
                success: true, 
                message: "Landlord updated successfully",landlord });
                
    } catch (error) {
        return res.send("something went wrong");
    }
};

export const deleteLandlord = async (req, res) => {
    const { _id} = req.query;

    try {
        const deleteLandlord = await Landlord.findByIdAndDelete
        (_id);
        return res.json(deleteLandlord);
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ error: "Cannot delete Landlord" });    
    }
}

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
