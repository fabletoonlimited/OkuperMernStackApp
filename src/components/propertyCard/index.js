import React from "react";
import Image from "next/image";
import StarRating from "../starRating/starRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function PropertyCard({
    _id,
    previewPic,
    unitsAvailable,
    price,
    savedHomes,
    title,
    desc,
    address,
    location,
    category,
    rating,
    bed,
    numberOfBed,
    bath,
    numberOfBath,
    propertyType,
}) {
    const imageSrc = previewPic || "/property-image.jpg";

    return (
        <Link href={`/propertyCardExpanded?id=${_id}`}>
            <div
                className="w-full rounded-xl overflow-hidden shadow-md 
                bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                {/* IMAGE */}
                <div className="relative w-full h-64">
                    <Image
                        src={imageSrc}
                        alt={`Property: ${title || desc || "Property"}`}
                        fill
                        className="object-cover rounded-t-xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={true}
                        draggable={false}
                    />

                    {savedHomes && (
                        <div className="absolute top-2 right-2 h-12 w-12 md:h-16 md:w-16 bg-blue-900/75 rounded-full border-2 border-white flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="text-white text-2xl md:text-4xl"
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

                {/* INFO */}
                <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold mt-2 mb-2">
                        ₦
                        {price
                            ? Number(
                                  String(price).replace(/[^0-9.]/g, ""),
                              ).toLocaleString()
                            : "N/A"}{" "}
                        / yr
                    </h3>

                    <p className="text-sm text-gray-800 mt-2">
                        {title || desc || "No description provided"}
                    </p>

                    <p className="text-sm font-medium text-blue-700 mt-1 mb-2">
                        {address || location || "Unknown location"}
                    </p>

                    <p className="text-md font-bold text-blue-950">
                        For {category || "Unspecified"}
                    </p>

                    {rating && (
                        <>
                            <div className="ratings mt-3 mb-2 justify-items-center">
                                <StarRating rating={rating} />
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                                {rating}{" "}
                                <span className="text-blue-700">
                                    ({category})
                                </span>
                            </p>
                        </>
                    )}

                    <div className="flex flex-wrap justify-around items-center mt-2 mb-4 gap-2">
                        <span className="text-sm bg-blue-950 text-white px-4 py-2 rounded">
                            {bed || numberOfBed || "N/A"}
                        </span>
                        <span className="text-sm bg-blue-950 text-white px-4 py-2 rounded">
                            {propertyType || "N/A"}
                        </span>
                        <span className="text-sm bg-blue-950 text-white px-4 py-2 rounded">
                            {bath || numberOfBath || "N/A"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
