import Property from "../models/propertyModel.js"
import { NextResponse } from "next/server";

//Create Property
export const createProperty = async (data) => {
    const {
        previewPic, 
        Img1, Img2, Img3, Img4, Img5, Img6, 
        title, address, 
        price, category, 
        propertyType, bed, 
        bath, features, 
        listedBy, savedHomes, 
        unitsAvailable, rating
    } = data;

    if (!Img1 || !Img2 || !Img3 
        || !title || !address 
        || !price || !category 
        || !propertyType || !bed 
        || !bath || !features 
        || !listedBy) {
        throw new Error("Missing required fields");
    }

    let newProperty;

    try {  
        newProperty = await Property.create({
            previewPic, 
            Img1, Img2, Img3, Img4, Img5, Img6, 
            title, 
            address, price, category, 
            propertyType, bed, bath, 
            features, listedBy, savedHomes, 
            unitsAvailable, 
            rating,
            user,
            landlord,
            isVerified: false
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