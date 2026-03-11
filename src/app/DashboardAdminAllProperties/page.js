"use client";

import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar/index"
const Page = () => {
    const properties = [
        {
            id: "SLR-102",
            status: "Rented",
            listed: "13 Jan 2024",
            sold: "13 Jun 2024",
            price: "₦1,000,000",
            property: "Greenwood 1",
            image: "/property1.jpg",
        },
        {
            id: "SLR-103",
            status: "Sold",
            listed: "20 Feb 2024",
            sold: "10 Jul 2024",
            price: "₦2,500,000",
            property: "Palm View Estate",
            image: "/property2.jpg",
        },
        {
            id: "SLR-104",
            status: "Vacant",
            listed: "5 Mar 2024",
            sold: "12 jul 2025",
            price: "₦850,000",
            property: "Sunrise Apartments",
            image: "/property3.jpg",
        },
    ];

    // Function to get text color only
    const getStatusTextColor = (status) => {
        if (status === "Rented" || status === "Sold") return "text-green-700";
        if (status === "Vacant") return "text-red-700";
        return "text-gray-700";
    };

    return (
        <><AdminDashboardSidebar/>
        <div className="mt-6 p-6 bg-auto">
            <h2 className="font-semibold mb-4 text-2xl">All Properties</h2>

            {/* Header */}
            <div className="grid grid-cols-6  font-medium text-gray-500 p-3">
                <span>ID</span>
                <span>Status</span>
                <span>Listed</span>
                <span>Sold / Rented</span>
                <span>Price</span>
                <span>Property</span>
            </div>

            {/* Rows */}
            <div className="rounded-lg p-3">
                {properties.map((p, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-6 items-center text-sm py-3 px-3 mb-3 bg-white rounded-lg shadow-sm">
                        <span>{p.id}</span>

                        {/* Status Badge with gray background and colored text */}
                        <span
                            className={`text-xs px-3 py-1 rounded-full w-fit font-medium bg-gray-200 ${getStatusTextColor(
                                p.status,
                            )}`}>
                            {p.status}
                        </span>

                        <span>{p.listed}</span>
                        <span>{p.sold}</span>

                        {/* Price */}
                        <span className="flex items-center gap-1 font-medium">
                            <FaMoneyBillWave /> {p.price}
                        </span>

                        {/* Property with round image */}
                        <span className="flex items-center gap-2">
                            <img
                                src={p.image}
                                alt={p.property}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            {p.property}
                        </span>
                    </div>
                ))}
            </div>
        </div></>
    );
};

export default Page;
