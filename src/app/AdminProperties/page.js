import React from "react";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar";
import Link from "next/link";
const properties = [
    {
        id: 1,
        name: "Greenwood 1",
        status: "Sold",
        listed: "11 Mar 2014",
        sold: "9 Jan 2024",
        amount: "$500,000",
        code: "SHP-102",
    },
    {
        id: 2,
        name: "Greenwood 2",
        status: "Rent",
        listed: "13 Jan 2015",
        sold: "16 Jan 2024",
        amount: "$500,000",
        code: "SHP-102",
    },
    {
        id: 3,
        name: "Greenwood 3",
        status: "Listed",
        listed: "11 Mar 2014",
        sold: "9 Jan 2024",
        amount: "$500,000",
        code: "SHP-102",
    },
];

const statusStyles = {
    Sold: "bg-green-100 text-green-600",
    Rent: "bg-red-100 text-red-600",
    Listed: "bg-blue-100 text-blue-600",
};

function PropertyRow({ property }) {
    return (
        <div> 
            <AdminDashboardSidebar />
            <Link href="/propertyDetail">
        <div className="grid grid-cols-6 items-center bg-white rounded-lg shadow-sm px-4 py-3 mb-3 ">
            {/* Property */}
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-sm">
                    i
                </div>
                <span className="font-semibold  text-gray-500">
                    {property.name}
                </span>
            </div>

            {/* Status */}
            <div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[property.status]}`}>
                    {property.status}
                </span>
            </div>

            {/* Listed */}
            <div className="text-gray-500 text-sm font-semibold">{property.listed}</div>

            {/* Sold/Rent Date */}
            <div className="text-gray-500 text-xs font-semibold">{property.sold}</div>

            {/* Amount */}
            <div className="text-gray-500 font-semibold">{property.amount}</div>

            {/* Property Code */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <span className="text-gray-500 text-sm font-semibold">{property.code}</span>
            </div>
                </div>
            </Link>
        </div>
       
    );
}

export default function PropertiesPage() {
    return (
        <div>
            <AdminDashboardSidebar/>
        <div className="bg-gray-50 min-h-screen p-8">
            <h1 className="text-2xl font-semibold mb-6">All Properties</h1>

            {/* Header */}
            <div className="grid grid-cols-6 text-gray-500 text-sm mb-3 px-4">
                <span> ID</span>
                <span>STATUS</span>
                <span>LISTED</span>
                <span>SOLD/RENTED</span>
                <span>AMOUNT</span>
                <span>PROPERTY</span>
            </div>

            {/* Rows */}
            {properties.map((property) => (
                <PropertyRow key={property.id} property={property} />
            ))}
            </div>
        </div>
    );
}
