import jwt from "jsonwebtoken"
import SuperAdmin from "../models/superAdminModel.js"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server.js";

// ================= Signup Admin =================
export const signupSuperAdmin = async (req) => {
    const body = await req.json();

    const {firstName, lastName, email, password} = body

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json 
        ({message: "All fields required"})
    }

    //Check if superAdmin already exists in DB
    const existingSuperAdmin = await SuperAdmin.findOne({isSuperAdmin: true});

    if (existingSuperAdmin) {
        return NextResponse.json(
        {message: "Super admin already exists"},
        {status: 400}
        )
    };

    //Create a new Super Admin
    try {
        const newSuperAdmin = new SuperAdmin({
            firstName,
            lastName,
            email,
            password,
            isSuperAdmin: true,
            });

        await newSuperAdmin.save();
        
        return NextResponse.json(
            {
                message: "Super Admin created Successfully",
                user: newSuperAdmin,
            },
            { status: 201 },
        )
    } catch (error) {
        console.log(error.message);
        return res.send("something went wrong");
    }
};

// ================= Login Admin =================
export const loginSuperAdmin = async (req) => {
    try{
        const {email, password} = req;

        if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password are required" },
            { status: 400 },
        );
        }

        const normalizedEmail = email.trim().tolowerCase();

        const superAdmin = await SuperAdmin.findOne({ email: normalizedEmail});
            if (!superAdmin) {
                return NextResponse.json(
                    {error: "Invalid credentials"},
                    {status: 400}
                );
            };
        
        const isMatch = bcrypt.compare(password, superAdmin.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        //create a token
        const token = jwt.sign(
            {id: superAdmin._id},
            process.env.JWT_SECRET,
            { expiresIn: "1d"});

        const response = NextResponse.json(
            {
                success: true,
                superAdmin: {
                id: superAdmin._id,
                name: `${superAdmin.firstName} ${superAdmin.lastName}`,
                email: superAdmin.email,
                },
                message: "Login successful",
            },
            { status: 200 },
        )

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000, // 1day
        });
        
        return response;

    } catch (err) {
        console.error("Login Error:", err.message);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
};

