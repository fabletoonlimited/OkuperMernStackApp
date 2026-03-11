"use client"; // Make sure this file is a Client Component

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faHouse, faBed } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar";


// Dummy data
const disputes = [
    {
        id: "DKDen - 1234",
        resident: "April Naomi",
        complaint: "Sink wasn't installed",
        rating: 5,
    },
    {
        id: "DKDen - 1234",
        resident: "April Naomi",
        complaint: "Sink wasn't installed",
        rating: 3,
    },
    {
        id: "DKDen - 1234",
        resident: "April Naomi",
        complaint: "Sink wasn't installed",
        rating: 4,
    },
];

const transactions = [
    {
        property: "Greenwood 1",
        status: "Rented",
        listed: "13 Jan 2024",
        date: "13 Jun 2024",
        amount: "₦1,000,000",
        code: "SLR-102",
    },
];

// Badge component
function Badge({ children, color }) {
    const colors = {
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600",
        blue: "bg-blue-100 text-blue-600",
    };
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
            {children}
        </span>
    );
}

// Sidebar component
function Sidebar({ images, setSelectedImage }) {
    return (
        <div className="w-72 bg-gray-100 p-6 border-r min-h-screen">
            <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 mb-2"></div>
                <p className="text-sm font-semibold">SLR-102</p>
                <p className="text-xs text-gray-500">LISTED ON: AUG 8 2025</p>
            </div>

            <button className="w-full bg-blue-900 text-white py-2 rounded mb-6 flex items-center justify-between px-4">
                ACTION
                <span className="transform rotate-90 text-white">{"›"}</span>
            </button>

            <div>
                <h3 className="font-semibold text-sm mb-2 text-black">
                    Primary Details
                </h3>
                <p className="text-xs text-gray-500">Primary Phone:</p>
                <p className="text-sm mb-2">+234 000 000 000</p>

                <p className="text-xs text-gray-600">Primary Email:</p>
                <p className="text-sm mb-4">owner@email.com</p>

                <p className="text-xs text-gray-600">Status:</p>
                <div className="flex gap-4 mt-1">
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        Vacant
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        Sold
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        Rented
                    </div>
                </div>

                <p className="text-xs text-gray-600 mt-4">Reports</p>
                <p className="text-sm">0</p>
            </div>
        </div>
    );
}

// Gallery component
function Gallery({ images, setSelectedImage }) {
    return (
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4">
            {/* Main large image */}
            <div className="relative col-span-2 row-span-2 rounded-lg border shadow-lg overflow-hidden aspect-[5/3] cursor-pointer">
                <img
                    src={images[0]}
                    alt="property-main"
                    className="w-full h-full object-cover"
                    onClick={() => setSelectedImage(images[0])}
                />
                <div className="absolute top-3 left-3">
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-3xl text-blue-400 bg-white rounded-full"
                    />
                </div>
            </div>

            {/* Four small images */}
            {Array.from({ length: 4 }).map((_, i) => {
                const img = images[i + 1] || images[0];
                return (
                    <div
                        key={i}
                        className="rounded-lg border shadow-md overflow-hidden cursor-pointer aspect-[5/3]"
                        onClick={() => setSelectedImage(img)}>
                        <img
                            src={img}
                            alt={`property-${i}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                );
            })}
        </div>
    );
}

// Disputes component
// Disputes component with header
function Disputes() {
    return (
        <div className="mt-6">
            <h2 className="font-semibold mb-4 text-2xl">Disputes</h2>
            <div className="grid grid-cols-4 text-sm font-semibold text-gray-500 p-3 ">
                <span>Dispute No</span>
                <span>Resident</span>
                <span>Complaint</span>
                <span>Rating</span>
            </div>
            <div className=" rounded-lg p-3">
                {/* Data rows with spacing */}
                {disputes.map((d, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-4 items-center text-sm py-3 px-3 mb-3 last:mb-0 bg-white rounded-lg">
                        <span>{d.id}</span>
                        <span>{d.resident}</span>
                        <span className="text-gray-500">{d.complaint}</span>
                        <span className="text-yellow-500">
                            {"★".repeat(d.rating)}
                            {"☆".repeat(5 - d.rating)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Transactions component
function Transactions() {
    return (
        <div className="bg-white rounded-lg p-4 mt-6 shadow-sm">
            <h2 className="font-semibold mb-4">Transactions</h2>
            {transactions.map((t, i) => (
                <div
                    key={i}
                    className="grid grid-cols-6 items-center text-sm bg-gray-50 p-3 rounded-lg mb-2">
                    <span>{t.property}</span>
                    <Badge color="green">{t.status}</Badge>
                    <span>{t.listed}</span>
                    <span>{t.date}</span>
                    <span className="font-medium">{t.amount}</span>
                    <span>{t.code}</span>
                </div>
            ))}
        </div>
    );
}

// Main Property Details Page
export default function PropertyDetailsPage() {
    const searchParams = useSearchParams();
    const propertyId = searchParams.get("id");

    const [property, setProperty] = useState(null);
    const [propertyLoading, setPropertyLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch property data from API
    useEffect(() => {
        if (!propertyId) {
            setPropertyLoading(false);
            return;
        }
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/property?id=${propertyId}`);
                if (!res.ok) throw new Error("Failed to fetch property");
                const data = await res.json();
                setProperty(data);
            } catch (err) {
                console.error(err);
            } finally {
                setPropertyLoading(false);
            }
        };
        fetchProperty();
    }, [propertyId]);

    const images = property
        ? [
              property.previewPic,
              property.Img1,
              property.Img2,
              property.Img3,
              property.Img4,
          ].filter(Boolean)
        : ["/property-image.jpg"];

    if (propertyLoading) return <div className="p-8">Loading property...</div>;

    return (
        <div>
            <AdminDashboardSidebar/>
        <div className="flex bg-gray-50">
            {/* Sidebar */}
            <Sidebar images={images} setSelectedImage={setSelectedImage} />

            {/* Main content */}
            <div className="flex-1 p-8">
                {/* Owner Info */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            Details{" "}
                            <FontAwesomeIcon
                                icon={faFileAlt}
                                className="text-gray-500"
                            />
                        </p>
                        <p className="font-semibold">Owner</p>
                        <p className="text-sm text-gray-600">Oluseun Oluto</p>
                        <p className="text-xs text-gray-400">
                            oluto.oluseun@gmail.com
                        </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <p>📍 84, Ikate road, Lekki, Lagos</p>
                    </div>
                </div>

                {/* Gallery */}
                <Gallery images={images} setSelectedImage={setSelectedImage} />

                {/* Property Info */}
                <div className="mt-4">
                    <h1 className="text-xl font-semibold">
                        4 Bedroom Flat with BQ
                    </h1>
                    <p className="text-gray-500">For Rent</p>
                    <p className="text-2xl font-bold mt-1">₦5,500,000 / yr</p>
                    <div className="flex justify-center gap-4 mt-4 h-full">
                        <button className="border-blue-900 border px-4 py-2 rounded w-full flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faHouse} /> Bungalow building
                        </button>
                        <button className="border-blue-900 border px-4 py-2 rounded w-full flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faBed} /> 3 Bed | 2 Toilet
                        </button>
                    </div>
                </div>

                {/* Disputes */}
                <Disputes />

                {/* Transactions */}
                <Transactions />
            </div>
            </div>
        </div>
    );
}
