import jwt from "jsonwebtoken";
import Tenant from "../models/tenantModel.js";

// 1. Authenticate tenant
export const authenticateTenant = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tenant = await Tenant.findById(decoded.id);

    if (!tenant) {
      return res.status(401).json({ message: "Landlorrd not found" });
    }

    req.tennat= {
      _id: tenant._id,
      email: tenant.email,
      admin: tenant.admin || false,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

