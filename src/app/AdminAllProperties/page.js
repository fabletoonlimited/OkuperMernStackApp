"use client";

import React, { useEffect, useState } from "react";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminAllPropertyPage() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch("/api/property");

                if (!res.ok) {
                    toast.error("Failed to fetch property details");
                    return;
                }

                const data = await res.json();
                setProperties(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load property");
            }
        };

        fetchProperty();
    }, []);

    return (
        <div className="flex">
            <AdminDashboardSidebar />

            <div className="bg-gray-50 min-h-screen p-8 w-full">
                <h1 className="text-2xl font-semibold mb-6">All Properties</h1>

                {/* Header */}
                <div className="grid grid-cols-6 items-center text-gray-400 text-xs mb-3 px-6 py-2 uppercase tracking-wide">
                    <div className="flex items-center">ID</div>
                    <div className="flex items-center">STATUS</div>
                    <div className="flex items-center">LISTED</div>
                    <div className="flex items-center">SOLD / RENTED</div>
                    <div className="flex items-center">AMOUNT</div>
                    <div className="flex justify-center">PROPERTY</div>
                </div>

                {properties.map((property) => (
                    <Link
                        key={property._id}
                        href={`/propertyDetail/${property._id}`}>
                        <div className="grid grid-cols-6 items-center bg-gray-100 rounded-md px-5 py-3 mb-2 text-sm">
                            {/* Name + Avatar */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-200 text-green-800 font-semibold text-xs">
                                    <img
                                        src={property.previewPic}
                                        alt="property"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-700">
                                        {property.title || "Property"}
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800">
                                    {property.status}
                                </span>
                            </div>

                            {/* Listed Date */}
                            <div className="text-gray-600 text-sm">
                                {new Date(
                                    property.createdAt,
                                ).toLocaleDateString()}
                            </div>

                            {/* Sold/Rented Date */}
                            <div className="text-gray-600 text-sm">
                                {new Date(
                                    property.updatedAt,
                                ).toLocaleDateString()}
                            </div>

                            {/* Price */}
                            <div className="text-gray-700 font-medium">
                                ₦{property.price}
                            </div>

                            {/* Property Image */}
                            <div className="flex justify-center gap-3">
                                <img
                                    src={property.previewPic}
                                    alt="property"
                                    className="w-8 h-8 rounded-full object-cover"
                                />

                                <span className="text-gray-400 text-xs mt-2">
                                    {property._id.slice(-3)}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
