"use client";

import React, { useEffect, useState } from "react";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminAllPropertyPage() {
    const [properties, setProperties] = useState([]);
    const [landlord, setLandlord] = useState([])

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

     useEffect(() => {
         const fetchLandlord = async () => {
             try {
                 const res = await fetch("/api/landlord");

                 if (!res.ok) {
                     toast.error("Failed to fetch landlord details");
                     return;
                 }

                 const data = await res.json();
                 setLandlord(data);
             } catch (error) {
                 console.error(error);
                 toast.error("Failed to load landlord");
             }
         };

         fetchLandlord();
     }, []);

    

    // Helper to get status badge classes with refined colors
    function getStatusClass(status) {
        switch (status) {
            case "Vacant":
                return "bg-red-100 text-red-700"; // light red background + bold red text
            case "Rented":
            case "Sold":
                return "bg-green-100 text-green-700"; // light green background + green text
            default:
                return "bg-gray-100 text-gray-600";
        }
    }

    return (
        <div className="flex">
            <AdminDashboardSidebar />

            <div className=" min-h-screen p-8 w-full">
                <h1 className="text-2xl font-semibold mb-6">All Properties</h1>

                {/* Header */}
                <div className="grid grid-cols-7 items-center gap-4 text-gray-400 text-xs mb-3 px-6 py-3 uppercase tracking-wider border-b">
                    <div>ID</div>
                    <div>Status</div>
                    <div>Listed</div>
                    <div>Sold / Rented</div>
                    <div>Amount</div>
                    <div>Property Name</div>
                    <div className="text-right">Property</div>
                </div>

                {properties.map((property) => (
                    <Link
                        key={property._id}
                        href={`/propertyDetail/${property._id}`}
                        className="no-underline">
                        <div className="grid grid-cols-7 items-center bg-white rounded-md px-5 py-3 mb-2 text-sm hover:bg-gray-200 transition cursor-pointer">
                            {/* ID */}
                            <div className="flex gap-3">
                            <div className="text-gray-700 font-medium">
                                {landlord.previewPic || "img"}
                            </div>
                            <div className="text-gray-700 font-medium">
                                {landlord.firstName || "name"}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                                        ${getStatusClass(
                                        property.status,
                                    )}`}>
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

                            {/* Amount */}
                            <div className="text-gray-700 font-medium">
                                ₦{property.price}
                            </div>

                            {/* Property Name */}
                            <div className="text-gray-700 font-semibold">
                                {property.title || "Property Name"}
                            </div>

                            {/* Property Image */}
                            <div className="flex justify-end items-center gap-2">
                                <img
                                    src={
                                        property.previewPic ||
                                        "/placeholder.png"
                                    }
                                    alt="property"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="text-gray-400 text-xs mt-1">
                                    {property._id?.slice(-3)}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
