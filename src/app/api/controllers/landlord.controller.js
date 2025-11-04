import Landlord from "../models/landlordModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const createLandlord = async (req, res) => {
    const {firstName, lastName, password, survey, agreement} = req.body
    const email = req.verifiedEmail;

    if (!firstName || !lastName || !email || !password || !survey || !agreement) {
        return res.json ({message: "All fields required"})
    }
        
    try {
        const existingLandlord = await Landlord.findOne({email});
        if(existingLandlord) {
            return res.status(400).json({message: "Landlord already exist, please sign in"})
        }

        //Create Landlord
        const newLandlord = new Landlord({
            firstName, 
            lastName, 
            email, 
            password, 
            survey, 
            agreement, 
        })

        //Save Landlord to DB
        const savedLandlord = await newLandlord.save();
        const {password: _, ...landlordData} = savedLandlord._doc;
        res.status(201).json(landlordData);
    } catch (error) {
        console.error("Error creating landlord:", error);
        return res.status(500).json({message:"something went wrong"});
    }
}

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
