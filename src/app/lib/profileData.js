import Landlord from "../api/models/landlordModel.js";
import Tenant from "../api/models/tenantModel.js";
import LandlordKyc from "../api/models/landlordKycModel.js";
import TenantKyc from "../api/models/tenantKycModel.js";

const buildProfile = (role, actor, kyc) => {
  const name = `${actor?.firstName || ""} ${actor?.lastName || ""}`.trim();

  const currentAddress = kyc?.currentAddress || "";

  return {
    _id: actor?._id,
    role,

    // Basic information
    firstName: actor?.firstName || "",
    lastName: actor?.lastName || "", 
    email: actor?.email || "",

    // KYC information
    phone: kyc?.phone || "",
    documentType: kyc?.documentType || "",
    idNumber: kyc?.idNumber || "",
    documentImage: kyc?.documentImage || "",
    status: kyc?.status || "pending",
    gender: kyc?.gender || "",
    age: kyc?.age || "",
    occupation: kyc?.occupation || "",
    specifyOccupation: kyc?.specifyOccupation || [],
    maritalStatus: kyc?.maritalStatus || "",
    spouseName: kyc?.spouseName || "",
    noOfChildren: kyc?.noOfChildren ?? 0,
    religion: kyc?.religion || "",
    companyName: kyc?.companyName || "",
    companyAddress: kyc?.companyAddress || "",
    companyPhone: kyc?.companyPhone || "",
    companyEmail: kyc?.companyEmail || "",

    // Address
    currentAddress: currentAddress || "",
    city: kyc?.city || "",
    state: kyc?.state || "",
    country: kyc?.country || "",
    zipCode: kyc?.zipCode || "",
    stateOfOrigin: kyc?.stateOfOrigin || "",

    // Profile image
    profilePic: kyc?.previewPic || "",
    avatar: kyc?.previewPic || "",
    previewPic: kyc?.previewPic || "",
  };
};

export const getProfileByActorId = async (actorId) => {
  if (!actorId) {
    return null;
  }

  const landlord = await Landlord.findById(actorId).lean();

  if (landlord) {
    const kyc = await LandlordKyc.findOne({
      landlord: actorId,
    }).lean();

    return {
      role: "landlord",
      profile: buildProfile("landlord", landlord, kyc),
    };
  }

  const tenant = await Tenant.findById(actorId).lean();

  if (tenant) {
    const kyc = await TenantKyc.findOne({
      tenant: actorId,
    }).lean();

    return {
      role: "tenant",
      profile: buildProfile("tenant", tenant, kyc),
    };
  }

  return null;
};
