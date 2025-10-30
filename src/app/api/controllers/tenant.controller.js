import Tenant from "../models/tenantModel";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const createTenant = async (req, res) => {
    const {firstName, lastName, password, survey, agreement} = req.body
    const email = req.verifiedEmail;

    if (!firstName || !lastName || !email || !password || !survey || !agreement) {
        return res.json ({message: "All fields required"})
    }
        
    try {
        const existingTenant = await Tenant.findOne({email});
        if(existingTenant) {
            return res.status(400).json({message: "Tenant already exist, please sign in"})
        }

        //Create Tenant
        const newTenant = new Tenant({
            firstName, 
            lastName, 
            email, 
            password, 
            survey, 
            agreement, 
        })

        //Save Tenant to DB
        const savedTenant = await newTenant.save();
        const {password: _, ...tenantData} = savedTenant._doc;
        res.status(201).json(tenantData);

    } catch (error) {
        console.error("Error creating tenant:", error);
        return res.status(500).json({message:"something went wrong"});
    }
}

export const loginTenant = async (req, res) => {
    try {
    const {email, password} = req.body;

    const tenant = await Tenant.findOne({email});
    if(!tenant) {
        return res.status(400).json({error: "Invalid credentials"})
    }

    const isMatch = bcrypt.compareSync(password, tenant.password);
    if(!isMatch) {
        return res.status(401).json({error: "invalid password"})
    };

    //create a token 
    const token = jwt.sign(
        { id:tenant._id},
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
        tenant: {
        id: tenant._id,
        name:`${tenant.firstName} ${tenant.lastName}`,
        email: tenant.email
        }
    });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getTenant = async (req, res) => {
    const {_id} = req.tenant;

    const tenant = await Tenant
    .findById(_id)
    .populate("User")
    .populate("Otp")
    .populate("TenantKyc")
    .populate("TenantDashboard")
    .populate("Property")

    return res.json(tenant);
};

export const getAllTenant = async (req, res) => {
    try {
        const allTenant = await Tenant
        .find()
        .select("-password")
        .findById(_id)
        .populate("User")
        .populate("Otp")
        .populate("TenantKyc")
        .populate("TenantDashboard")
        .populate("Property")
        
        return res.json(allTenant);

    } catch (error) {
        res.json({message: "error getting tenant"})
    }
};

export const updateTenant = async (req, res) => {
    const { _id } = req.body;
    try {
        const {firstName, lastName, email} = req.body

        // only self-update or admin
        if (req.tenant._id !== req.params.id && !req.admin) {
        return res.status(403).json({ success: false, message: "You are unauthorized" });
        }
    
        const tenant = await Tenant.findByIdAndUpdate
            (req.params.id,
            { firstName, lastName, email },
            { new: true, runValidators: true })
            
            .select("-password");

            if (!tenant) 
                return res.status(404).json({ 
                    success: false, 
                    message: "Tenant not found" 
                });

            res.status(200).json({ 
                success: true, 
                message: "Tenant updated successfully",tenant });
                
    } catch (error) {
        return res.send("something went wrong");
    }
};

export const deleteTenant = async (req, res) => {
    const {_id} = req.query;

    try {
        const deleteTenant = await Tenant.findByIdAndDelete
        (_id);
        return res.json(deleteTenant);
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ error: "Cannot delete Tenant" });    
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
