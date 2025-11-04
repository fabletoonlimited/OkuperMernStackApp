import jwt from "jsonwebtoken";
import Landlord from "../models/landlordModel.js";

// 1. Authenticate landlord
export const authenticateLandlord = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const landlord = await Landlord.findById(decoded.id);

    if (!landlord) {
      return res.status(401).json({ message: "Landlorrd not found" });
    }

    req.landlord= {
      _id: landlord._id,
      email: landlord.email,
      admin: landlord.admin || false,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

