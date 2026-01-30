import Property from "../models/propertyModel.js"
import { NextResponse } from "next/server";

//Create Property
export const createProperty = async (data) => {
    const {
      landlord,
      previewPic, 
      Img1, Img2, Img3, Img4, Img5, Img6, 
      title, address, 
      price, category, 
      propertyType, bed, 
      bath, features, 
      listedBy, savedHomes, 
      unitsAvailable, rating
    } = data;

    if (!previewPic) {
      throw new Error("Please uplaod a preview picture")
    } 
    
    if (!Img1 || !Img2 || !Img3) {
      throw new Error("Please uplod at least 3 images")
    } 
    
    if (!title) {
      throw new Error("Missing property title")
    } 
    
    if (!address) {
      throw new Error("Missing address fields")
    }
    
    if (!price) {
      throw new Error("Missing price fields")
    }
    
    if (!category) {
      throw new Error("Missing category fields")
    }
    
    if (!unitsAvailable) {
      throw new Error("Property units available missing")
    } 
    
    if (!bed) {
      throw new Error("At least one number of bed is required")
    }
    
    if (!bath) {
      throw new Error("At least one number of bath is required")
    }
    
    if (!features) {
      throw new Error("Missing property features")
    }
    
    if (!listedBy) {
      throw new Error("Property listed feature is required")
    } 
    
    if (existingProperty) {
      throw new Error("Property exists in the database. Kindly upload a new property")
    }

  let newProperty;

    try {  
      newProperty = await Property.create({
      user,
      landlord,
      previewPic, 
      Img1, 
      Img2, 
      Img3, 
      Img4, 
      Img5, 
      Img6, 
      title, 
      address, 
      price, 
      category, 
      unitsAvailable, 
      propertyType, 
      bed, 
      bath,
      rating,
      listedBy, 
      features: //"buildingAmenities", "propertyAmenities", "neighbourhoodPostcode", "nearbyPlaces", 
      savedHomes, 
      rating,
      isVerified
      }); 

        await newProperty.save();

    } catch (dbError) {
        console.error("DB error", dbError);
        throw new Error("Failed to create property")
    }

    //verify address
    try {
        const { OkHi } = await import("okhi");
        const okhi = new OkHi({key: process.env.OKHI_API_KEY});

        await okhi.verify.check({
            user: {
                firstName: listedBy.firstName,
                lastName: listedBy.lastName,
                phone: listedBy.phone
            },
            location: {
                address,
                country: "NG"
            },
            reference: `property-${newProperty._id}`
        });

    } catch (verifyError) {
        console.error("Verification failed:", verifyError.message);
    }

    return newProperty;  
};