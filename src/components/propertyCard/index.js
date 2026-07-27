"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"
import StarRating from "../starRating/starRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";


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
}) 
{
    const [property, setProperty] = useState(null);

    useEffect (() => {
        const fetchProperty = async() => {
            try { 
                const res = await fetch(`/api/property?id=${_id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch property");

            const data = await res.json();
            setProperty(data)

        } catch (error) {
            console.error(error);
        }}
        if (_id) {
            fetchProperty();
        }
    }, [_id]);

    const handleSaveProperty = async (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <Link href={`/propertyCardExpanded?id=${_id}`}>
            <div className="w-full rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">

                {/* IMAGE */}
                <div className="relative w-full h-64">
                    <Image
                        src={property?.previewPic || previewPic}
                        alt={`property: ${title || desc || "property"}`}
                        fill
                        className="object-cover rounded-t-xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        draggable={false}
                    />

                    {property?.savedHomes && (
                        <div className="absolute top-2 right-2 h-12 w-12 md:h-16 md:w-16 bg-blue-900/75 rounded-full border-2 border-white flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                onClick={handleSaveProperty}
                                className="text-white text-2xl md:text-4xl cursor-pointer"
                            />
                        </div>
                    )}

                    {typeof property?.unitsAvailable === "number" && (
                        <div className="absolute top-2 left-2 bg-blue-600/75 text-white text-xs px-2 py-1 rounded-xl">
                            {property?.unitsAvailable > 0
                                ? `${property?.unitsAvailable} unit${property?.unitsAvailable > 1 ? "s" : ""} available`
                                : "No units available"}
                        </div>
                    )}
                </div>

                {/* INFO */}
                <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold mt-2 mb-2">
                        ₦{property?.price
                            ? Number(String(property?.price).replace(/[^0-9.]/g, "")).toLocaleString()
                            : "N/A"}{" "}
                        / yr
                    </h3>

                    <p className="text-sm text-gray-800 mt-2">
                        {property?.title || property?.desc || "No description provided"}
                    </p>

                    <p className="text-sm font-medium text-blue-700 mt-1 mb-2">
                        {property?.address || property?.location || "Unknown location"}
                    </p>

                    <p className="text-md font-bold text-blue-950">
                        For {property?.category || "Unspecified"}
                    </p>

                    {property?.rating && (
                        <>
                            <div className="ratings mt-3 mb-2 justify-items-center">
                                <StarRating rating={property?.rating} />
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                                {property?.rating} <span className="text-blue-700">({property?.category})</span>
                            </p>
                        </>
                    )}

                    <div className="flex flex-wrap justify-around items-center mt-2 mb-4 gap-2">
                        <span className="text-sm bg-blue-950 text-white px-4 py-2 rounded">
                            {property?.bed || property?.numberOfBed || "N/A"}
                        </span>

                        <span className="text-sm bg-blue-950 text-white px-4 py-2 rounded">
                            {property?.propertyType || "N/A"}
                        </span>

                        <span className="text-sm bg-blue-950 text-white px-4 py-2 rounded">
                            {property?.bath || property?.numberOfBath || "N/A"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}