import Dispute from "../models/disputesModel.js";
import User from "../models/userModel.js";

// Create dispute
export const createDispute = async (data) => {
    const data = await req.json();

    const { tenant, property, complaint, rating } = data;

    if (!tenant || !property || !complaint || !rating) {
        throw new Error("Kindly fill all required fields");
    }

    const tenantDetails = await User.findById(tenant);

    if (!tenantDetails) {
        throw new Error("Tenant not found");
    }

    const newDispute = await Dispute.create({
        tenant,
        property,
        complaint,
        rating,
    });

  tenantDetails.disputes.push(newDispute._id);

  await tenantDetails.save();

  return newDispute;
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