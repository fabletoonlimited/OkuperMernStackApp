import Property from "../models/propertyModel.js";

export const createProperty = async (data) => {
  let {
    // user,
    // landlord: landlordId,
    previewPic,
    Img1,
    Img2,
    Img3,
    Img4,
    Img5,
    Img6,
    title,
    address,
    state,
    price,
    category,
    propertyType,
    bed,
    bath,
    features,
    listedBy,
    savedHomes,
    unitsAvailable,
    rating,
    isVerified,
  } = data;

  // Ensure features is always safe
  const safeFeatures = features ?? {
    buildingAmenities: [],
    propertyAmenities: [],
    neighbourhoodPostcode: "",
    nearbyPlaces: [],
  };

  // Validate required fields
  if (!previewPic) throw new Error("Please upload a preview picture");
  if (!Img1 || !Img2 || !Img3) throw new Error("Please upload at least 3 images");
  if (!title) throw new Error("Missing property title");
  if (!address) throw new Error("Missing address field");
  if (!state) throw new Error("Missing state field");
  if (!price) throw new Error("Missing price field");
  if (!category) throw new Error("Missing category field");
  if (!unitsAvailable) throw new Error("Property units available missing");
  if (!bed) throw new Error("At least one number of bed is required");
  if (!bath) throw new Error("At least one number of bath is required");
  if (!listedBy) throw new Error("Property listed by is required");

  // Format address safely
  // const formattedAddress = `${address?.line1 || ""} ${address?.line2 || ""}`.trim();

  // Use **strings** for images (your schema expects string)
  previewPic = Array.isArray(previewPic) ? previewPic[0]?.url || previewPic[0] || previewPic : previewPic;
  Img1 = Array.isArray(Img1) ? Img1[0]?.url || Img1[0] || Img1 : Img1;
  Img2 = Array.isArray(Img2) ? Img2[0]?.url || Img2[0] || Img2 : Img2;
  Img3 = Array.isArray(Img3) ? Img3[0]?.url || Img3[0] || Img3 : Img3;
  Img4 = Array.isArray(Img4) ? Img4[0]?.url || Img4[0] || Img4 : Img4;
  Img5 = Array.isArray(Img5) ? Img5[0]?.url || Img5[0] || Img5 : Img5;
  Img6 = Array.isArray(Img6) ? Img6[0]?.url || Img6[0] || Img6 : Img6;

  savedHomes = Array.isArray(savedHomes) ? savedHomes : [];

  try {
    const newProperty = await Property.create({
      // user,
      landlordId,
      previewPic,
      Img1,
      Img2,
      Img3,
      Img4,
      Img5,
      Img6,
      title,
      // address: formattedAddress,
      address,
      state,
      price,
      category,
      unitsAvailable,
      propertyType,
      bed,
      bath,
      features: safeFeatures,
      listedBy,
      savedHomes,
      rating: rating || 0,
      isVerified: isVerified ?? true,
    });

    return newProperty;
  } catch (dbError) {
    console.error("DB error:", dbError);
    throw new Error("Failed to create property");
  }
};



    //verify address
//     try {
//         const { OkHi } = await import("okhi");
//         const okhi = new OkHi({key: process.env.OKHI_API_KEY});

//         await okhi.verify.check({
//             user: {
//                 firstName: listedBy.firstName,
//                 lastName: listedBy.lastName,
//                 phone: listedBy.phone
//             },
//             location: {
//                 address,
//                 country: "NG"
//             },
//             reference: `property-${newProperty._id}`
//         });

//     } catch (verifyError) {
//         console.error("Verification failed:", verifyError.message);
//     }

//     return newProperty;  
