const PROFILE_REQUIRED_FIELDS = {
  tenant: ["firstName", "lastName", "email", "phone"],
  landlord: ["firstName", "lastName", "email", "phone"],
};

const PROFILE_SECTIONS = {
  basic: ["firstName", "lastName", "email", "phone"],
  identity: ["documentType", "idNumber", "documentImage"],
  personal: ["gender", "age", "occupation", "maritalStatus", "religion"],
  work: ["companyName", "companyAddress", "companyPhone", "companyEmail"],
  address: ["currentAddress", "city", "state", "country", "zipCode"],
};

const isPresent = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return !Number.isNaN(value);
  }

  if (typeof value === "boolean") {
    return value === true;
  }

  return true;
};

export const computeProfileCompletion = (profile, role) => {
  const normalizedRole = role === "landlord" ? "landlord" : "tenant";
  const baseFields = PROFILE_REQUIRED_FIELDS[normalizedRole] || [];

  const sectionKeys = Object.keys(PROFILE_SECTIONS);
  const sectionWeight = sectionKeys.length ? 100 / sectionKeys.length : 0;

  const percent = sectionKeys.reduce((total, key) => {
    const sectionFields = PROFILE_SECTIONS[key] || [];
    if (sectionFields.length === 0) return total;

    const filledCount = sectionFields.filter((field) =>
      isPresent(profile?.[field]),
    ).length;

    const sectionScore = (filledCount / sectionFields.length) * sectionWeight;
    return total + sectionScore;
  }, 0);

  const allFields = sectionKeys.flatMap((key) => PROFILE_SECTIONS[key] || []);
  const fields = allFields.length ? allFields : baseFields;
  const missingFields = fields.filter((field) => !isPresent(profile?.[field]));

  return { percent: Math.round(percent), missingFields };
};
