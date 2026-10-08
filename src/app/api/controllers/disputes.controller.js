import Dispute from "@/app/api/models/disputeModel.js";
import Tenant from "../models/tenantModel.js";
import Property from "../models/propertyModel.js";

export const createDispute = async (data) => {
    const {
        tenant,
        property,
        complaint,
        rating,
    } = data;

    if (!tenant || !property || !complaint || !rating) {
        throw new Error("Kindly fill all required fields");
    }

    // Find tenant
    const tenantDetails = await Tenant.findById(tenant);

    if (!tenantDetails) {
        throw new Error("Tenant not found");
    }

    // Find property
    const propertyDetails = await Property.findById(property);

    if (!propertyDetails) {
        throw new Error("Property not found");
    }

    // Get landlord who owns the property
    const landlordId = propertyDetails.landlord;

    if (!landlordId) {
        throw new Error("This property has no landlord");
    }

    // Create dispute
    const newDispute = await Dispute.create({
        tenant: tenantDetails._id,
        property: propertyDetails._id,
        landlord: landlordId,
        complaint: complaint.trim(),
        rating,
    });

    // If Tenant schema has disputes array
    if (tenantDetails.disputes) {
        tenantDetails.disputes.push(newDispute._id);
        await tenantDetails.save();
    }

    return newDispute;
};

// Get disputes
export const getDisputes = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    return await Dispute.find({ user: userId })
        .populate("user", "firstName lastName email")
        .populate("property");
};


// Get tenant disputes
export const getTenantDisputes = async (tenantId) => {
    if (!tenantId) {
        throw new Error("Tenant ID is required");
    }

    return await Dispute.find({ tenant: tenantId })
        .populate("tenant", "firstName lastName email")
        .populate("property");
};


// Update dispute status
export const updateDisputeStatus = async (disputeId, status) => {
    if (!disputeId || !status) {
        throw new Error("Dispute ID and status are required");
    }

    const dispute = await Dispute.findByIdAndUpdate(
        disputeId,
        { status },
        { new: true }
    );

    if (!dispute) {
        throw new Error("Dispute not found");
    }

    return dispute;
};


// Delete dispute
export const deleteDispute = async (disputeId) => {
    if (!disputeId) {
        throw new Error("Dispute ID is required");
    }

    const dispute = await Dispute.findByIdAndDelete(disputeId);

    if (!dispute) {
        throw new Error("Dispute not found");
    }

    return dispute;
};