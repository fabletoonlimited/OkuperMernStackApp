"use client";

import React, { useEffect, useState } from "react";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


export default function AdminAllPropertyPage() {
    const [property, setProperty] = useState([]);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch("/api/property", {
                    method:"GET",
                    body: JSON.stringify({
                        _id,
                        status,
                        payment,
                        timestamps,
                        price,
                        previewpic,
 
                    })
                });
                if (!res.ok) {
                    toast.error("Failed to fetch property details");
                    return;
                } 
                
                const data = await res.json();
                setProperty(data);
            } catch (error) {
                toast.error("Failed to load property")
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
                <div className="grid grid-cols-6 text-gray-500 text-sm mb-3 px-4">
                    <span>ID</span>
                    <span>STATUS</span>
                    <span>LISTED</span>
                    <span>SOLD/RENTED</span>
                    <span>AMOUNT</span>
                    <span>PROPERTY</span>
                </div>

                {/* Rows
                {properties.map((property) => (
                    <PropertyRow key={property._id} property={property} />
                ))} */}
                <Link href="/propertyDetail">
                    <div className="grid grid-cols-6 items-center bg-white rounded-lg shadow-sm px-4 py-3 mb-3">
                        {/* Property */}
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-sm">
                                
                            </div>
                            <span className="font-semibold text-gray-500">
                                {property._id}
                            </span>
                        </div>

                        {/* Status */}
                        <div>
                            <span
                                className={
                                    "px-3 py-1 rounded-full text-xs font-semibold"
                                }>
                                {property.status}
                            </span>
                        </div>

                        {/* Listed */}
                        <div className="text-gray-500 text-sm font-semibold">
                            {property.timestamps}
                        </div>

                        {/* Sold/Rent Date */}
                        <div className="text-gray-500 text-xs font-semibold">
                            {property.timestamps}
                        </div>

                        {/* Amount */}
                        <div className="text-gray-500 font-semibold">
                            {property.price}
                        </div>

                        {/* Property Code */}
                        <div className="flex items-center gap-2">
                            {property.previewPic}
                            {/* <span className="text-gray-500 text-sm font-semibold">
                        {property.code}
                    </span> */}
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
