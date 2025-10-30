import LandlordKyc from "../models/landlordKycModel.js";
import User from "../models/userModel.js";
import Landlord from "../models/landlordModel.js";
import LandlordDashboard from "../models/landlordDashboardModel.js";

// Create Landlord KYC
export const createLandlordKyc = async (req, res) => {
    try {
        const { phone, documentType, idNumber, status, ...others } = req.body;
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!phone || !documentType || !idNumber) {
            return res.status(400).json({ message: "Phone, Document Type, and ID Number are required" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if landlord exists
        const landlord = await Landlord.findOne({ user: userId });
        if (!landlord) {
            return res.status(404).json({ message: "Landlord profile not found" });
        }

        // Check if landlord dashboard exists
        const landlordDashboard = await LandlordDashboard.findOne({ landlord: landlord._id });
        if (!landlordDashboard) {
            return res.status(404).json({ message: "Landlord dashboard not found" });
        }

        // Create Landlord KYC record
        const landlordKyc = new LandlordKyc({
            user: userId,
            landlord: landlord._id,
            landlordDashboard: landlordDashboard._id,
            phone,
            documentType,
            idNumber,
            documentUrl,
            status: status || "Pending",
            ...others
        });

        await landlordKyc.save();
    } catch (error) {
        console.error("Error in createLandlordKyc:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
