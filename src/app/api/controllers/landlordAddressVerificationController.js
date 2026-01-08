import AddressVerification from "../models/addressVerification.js";
import { streamUpload } from "../../lib/streamUpload.js";

// Create a new address with utility bill
export const createAddress = async (req, res) => {
  try {
    if (!req.landlord || !req.landlord.id) {
      return res.status(401).json({ message: "Unauthorized: landlord not found in request" });
    }
    const landlordId = req.landlord.id;
    const { street, city, state, country, zipCode } = req.body;

    if (!req.files || !req.files.utilityBill || req.files.utilityBill.length === 0) {
      return res.status(400).json({ message: "Utility bill is required" });
    }

    const utilityBillFile = req.files.utilityBill[0];
    const uploadResult = await streamUpload(utilityBillFile.buffer, "Bills&ID");

    const newAddress = new AddressVerification({
      landlord: landlordId,
      street,
      city,
      state,
      country,
      zipCode,
      verificationDetails: {
        billType: utilityBillFile.mimetype.includes("image") ? "Image" : "Document",
        billUrl: uploadResult.secure_url,
      },
    });

    await newAddress.save();
    res.status(201).json({ message: "Address created successfully", address: newAddress });

  } catch (error) {
    console.error("Error uploading utility bill:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all addresses for a landlord
export const getAddress = async (req, res) => {
  try {
    if (!req.landlord || !req.landlord.id) {
      return res.status(401).json({ message: "Unauthorized: landlord not found in request" });
    }
    const landlordId = req.landlord.id;

    const addresses = await AddressVerification
      .find({ landlord: landlordId })
      .populate("landlord", "name email");

    res.status(200).json({ addresses });

  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    if (!req.landlord || !req.landlord.id) {
      return res.status(401).json({ message: "Unauthorized: landlord not found in request" });
    }
    const landlordId = req.landlord.id;
    const addressId = req.params.id;

    const { street, city, state, country, zipCode } = req.body;

    const address = await AddressVerification.findOne({_id: addressId, landlord: landlordId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (country) address.country = country;
    if (zipCode) address.zipCode = zipCode;

    if (req.files && req.files.utilityBill && req.files.utilityBill.length > 0) {
      const utilityBillFile = req.files.utilityBill[0];
      const uploadResult = await streamUpload(utilityBillFile.buffer, "Bills&ID");

      if (!address.verificationDetails) {
        address.verificationDetails = {};
      }

      address.verificationDetails.billType = utilityBillFile.mimetype.includes("image") ? "Image" : "Document";
      address.verificationDetails.billUrl = uploadResult.secure_url;
    }

    await address.save();
    res.status(200).json({ message: "Address updated successfully", address });

  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    if (!req.landlord || !req.landlord.id) {
      return res.status(401).json({ message: "Unauthorized: landlord not found in request" });
    }
    const landlordId = req.landlord.id;
    const addressId = req.params;

    const address = await AddressVerification.findOneAndDelete({ _id: addressId, landlord: landlordId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });

  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
