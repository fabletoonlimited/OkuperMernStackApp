
const PROFILE_SECTIONS = {
  basic: [
    "previewPic",
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
    "age",
    "occupation",
    "maritalStatus",
    "religion",
  ],

  work: [
    "companyName",
    "companyAddress",
    "companyPhone",
  ],

  address: [
    "currentAddress",
    "city",
    "state",
    "country",
    "stateOfOrigin",
  ],
};

const isPresent = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((item) =>
      typeof item === "string" ? item.trim().length > 0 : item !== null && item !== undefined
    );
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return !Number.isNaN(value);
  }

  return true;
};

export const computeProfileCompletion = (profile) => {
  const sectionKeys = Object.keys(PROFILE_SECTIONS);

  const sectionWeight = 100 / sectionKeys.length;

  let percent = 0;

  for (const key of sectionKeys) {
    const fields = PROFILE_SECTIONS[key];

    const filledCount = fields.filter((field) =>
      isPresent(profile?.[field])
    ).length;

    percent += (filledCount / fields.length) * sectionWeight;
  }

  const allFields = sectionKeys.flatMap(
    (key) => PROFILE_SECTIONS[key]
  );

  const missingFields = allFields.filter(
    (field) => !isPresent(profile?.[field])
  );

  return {
    percent: Math.round(percent),
    missingFields,
  };
};
