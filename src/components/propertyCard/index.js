import React from "react";
import Image from "next/image";
import property from "../../data/property";
import StarRating from "../starRating/starRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import PropertyExpandedNav from "../propExpandedNav/index.js";
import Link from "next/link";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Cloudinary config

export default function PropertyCard({
    previewPix,
    unitsAvailable,
    price,
    savedHomes,
    desc,
    location,
    category,
    rating,
    numberOfBed,
    propertyType,
    numberOfBath,
}) {
    // const NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "dfdzbuk0c";
    // const BASE_URL = `https://res.cloudinary.com/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
    // const firstImage =
    //     Array.isArray(img) && img[0]?.publicId
    //         ? img[0].publicId
    //         : "placeholder-image.jpg";

    // const CLOUDINARY_URL = `${BASE_URL}/${firstImage}`;
    // const BLUR_URL = `${BASE_URL}/${firstImage || fallbackImage}`;

    const handleInputChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const [formData, setFormData] = useState({
        previewPix,
        unitsAvailable,
        price,
        savedHomes,
        desc,
        location,
        category,
        rating,
        numberOfBed,
        propertyType,
        numberOfBath,
    });

    if (
        !formData.previewPix ||
        !formData.unitsAvailable ||
        !formData.price ||
        !formData.savedHomes ||
        !formData.desc ||
        !formData.location ||
        formData.location ||
        !formData.category ||
        !formData.rating ||
        !formData.numberOfBed ||
        !formData.propertyType ||
        !formData.numberOfBath
    ) {
        toast.error("Please fill all required fields");
        return;
    }

    const fetchProperties = async () => {
        try {
            const propertyResponse = await fetch("/api/propertyListing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _id,
                    previewPix: formData.previewPix,
                    unitsAvailable: formData.unitsAvailable,
                    price: formData.price,
                    desc: formData.desc,
                    location: formData.location,
                    category: formData.categories,
                    rating: formData.rating,
                    numberOfBed: formData.numberOfBed,
                    propertyType: formData.propertyType,
                    numberOfBath: formData.numberOfBath,
                }),
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Link href={"/propertyCardExpanded"}>
                <div
                    className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow duration-300 
        w-[310px] md:min-w-[310px] md:min-h-[520px] min-h-[520px] md:mt-13 mt-0 col-span-full hover:scale-105"
                    style={{
                        maxWidth: "310px",
                        minHeight: "520px",
                        maxHeight: "520px",
                        minWidth: "310px",
                        cursor: "pointer",
                    }}>
                    <div className="relative h-72 w-[310px] md:h-72">
                        <Image
                            src={CLOUDINARY_URL}
                            blurDataURL={BLUR_URL}
                            alt={`Property: ${desc || "No description"}`}
                            width={310}
                            height={250}
                            placeholder="blur"
                            draggable={false}
                            unoptimized={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={100}
                            priority={true}
                            className="rounded-t-xl object-cover"
                        />

                        {savedHomes && (
                            <div className="2 md:right-2 h-12 w-12 md:h-16 md:w-16 bg-blue-900/75 rounded-full border-2 border-white">
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="text-blue-800/75 text-2xl md:text-4xl"
                                />
                            </div>
                        )}

                        {typeof unitsAvailable === "number" && (
                            <div className="absolute top-2 left-2 bg-blue-600/75 text-white text-xs px-2 py-1 rounded-xl">
                                {unitsAvailable > 0
                                    ? `${unitsAvailable} unit${unitsAvailable > 1 ? "s" : ""} available`
                                    : "No units available"}
                            </div>
                        )}
                    </div>

                    <div className="p-4 text-center -mt-30 md:-mt-30">
                        <h3 className="text-lg font-semibold mt-10 mb-2">
                            ₦{price ? price.toLocaleString() : "N/A"} / yr
                        </h3>

                        <p className="text-sm text-gray-800 mt-2">
                            {desc || "No description provided mb-4"}
                        </p>

                        <p className="text-sm font-medium text-blue-700 mt-1 mb-4">
                            {location || "Unknown location"}
                        </p>

                        <p className="text-md font-bold text-blue-950">
                            For {category || "Unspecified"}
                        </p>

                        <div className="ratings mt-3 mb-4 justify-items-center">
                            <StarRating rating={rating || 0} />
                        </div>

                        {rating && (
                            <p className="text-sm text-gray-500 mb-4">
                                {rating}{" "}
                                <span className="text-blue-700">
                                    ({category})
                                </span>
                            </p>
                        )}

                        <div className="flex gap-2 mt-2 justify-items-center mb-5 md:ml-2 ml-2">
                            <span className="text-sm bg-blue-900 text-white px-2 py-1 rounded">
                                {numberOfBed ?? 0} Bdr
                            </span>
                            <span className="text-sm bg-blue-900 text-white px-2 py-1 rounded">
                                {propertyType || "N/A"}
                            </span>
                            <span className="text-sm bg-blue-900 text-white px-2 py-1 rounded">
                                {numberOfBath ?? 0} Bath
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}
