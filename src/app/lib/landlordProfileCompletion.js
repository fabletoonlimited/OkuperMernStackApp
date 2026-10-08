const PROFILE_SECTIONS = {
  basic: [
    "firstName",
    "lastName",
    "email",
    "phone",
  ],

  identity: [
    "documentType",
    "idNumber",
    "documentImage",
  ],

  personal: [
    "previewPic",
    "gender",
    "age",
    "stateOfOrigin",
  ],

  address: [
    "currentAddress",
    "city",
    "state",
    "country",
  ],
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
  if (role !== "landlord") {
    return {
      percent: 0,
      missingFields: [],
    };
  }

  const sectionKeys = Object.keys(PROFILE_SECTIONS);

  const allFields = sectionKeys.flatMap(
    (key) => PROFILE_SECTIONS[key]
  );

  const missingFields = allFields.filter(
    (field) => !isPresent(profile?.[field])
  );

  const completedFields = allFields.length - missingFields.length;

  const percent = Math.round(
    (completedFields / allFields.length) * 100
  );

  return {
    percent,
    missingFields,
  };
};