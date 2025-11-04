import jwt from "jsonwebtoken"
import Admin from "../models/adminModel.js"
import bcrypt from "bcryptjs"

// ================= Create Admin =================
export const createAdmin = async (req, res) => {
    const {firstName, lastName, email, password} = req.body

    if (firstName || lastName || email || password) {
        return res.status(400).json ({message: "All fields required"})
    }

    //Check if user already exists in DB
    const existingUser = await Admin.findOne({email});
    if (existingUser) {
        return res.status(400).json({message: "Admin already exists"})
    };

    //Create a new Admin
    try {
        const newAdmin = await newAdmin.save();
        return res.json(savedAdmin)

    } catch (error) {
        console.log(error.message);
        return res.send("something went wrong");
    }
};

// ================= Login Admin =================
export const loginAdmin = async (req, res) => {
    const {email, password} = req.body;

    //validate Admin
    const admin = await Admin.findOne({email})
        if (!admin) {
            return res.status(404).json({error: "Invalid credentials"})
        };
    
    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
    }

//create a token
    const token = jwt.sign(
        {id: admin._id},
        process.env.JWT_SECRET,
        { expiresIn: "7d"});

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 *1000, //1 day
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });

    return res.status(200).json({
        success: true,
        message: "Login succssful",
        admin: {
            id: admin._id,
            fullName: admin.fullName,
            email: admin.email
        }
    });
};

//============GetOneAdmin===================
export const getAdmin = async (req, res) => {
    const {_id} = req.admin;

    const admin = await Admin
        .findById(_id)
        .populate("payments")
        return res.json(admin);
};
