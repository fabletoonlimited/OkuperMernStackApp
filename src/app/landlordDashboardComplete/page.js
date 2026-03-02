"use client";

import React, { useState, useEffect } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar/index.js";
import PropertyCard from "@/components/propertyCard";
import { FaHome, FaMoneyBillWave, FaEye, FaClock } from "react-icons/fa";

const page = () => {
    const [profilePercent, setProfilePercent] = useState(100);

    useEffect(() => {
        const fetchCompletion = async () => {
            try {
                const res = await fetch("/api/profile/completion", {
                    credentials: "include",
                });

                if (!res.ok) {
                    setProfilePercent(null);
                    return;
                }

                const data = await res.json();
                setProfilePercent(
                    Number.isFinite(data.percent) ? data.percent : 0
                );
            } catch (err) {
                console.error("Profile completion error:", err);
                setProfilePercent(null);
            }
        };

        fetchCompletion();
    }, []);

    return (
        <>
            {profilePercent === 87 && (
                <div className="flex min-h-screen bg-gray-100">
                    
                    {/* Sidebar (fixed width) */}
                    <div className="w-64 fixed left-0 top-0 h-full bg-white shadow-md z-40">
                        <LandlordDashboardSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="ml-64 flex-1 p-6">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-sm text-blue-950">
                                    Mon, 18 2026
                                </p>
                                <h1 className="text-2xl font-bold">
                                    Welcome back, Name!
                                </h1>
                                <p className="text-blue-950">
                                    This is your dashboard summary report
                                </p>
                            </div>

                            <img
                                src="https://i.pravatar.cc/40"
                                className="w-10 h-10 rounded-full"
                                alt="profile"
                            />
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            
                            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-full text-green-600">
                                    <FaHome />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Total Properties
                                    </p>
                                    <h2 className="text-xl font-bold">1330</h2>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                                    <FaMoneyBillWave />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Total Income
                                    </p>
                                    <h2 className="text-xl font-bold">N33M</h2>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                                <div className="bg-red-100 p-3 rounded-full text-red-600">
                                    <FaEye />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Total Views
                                    </p>
                                    <h2 className="text-xl font-bold">84K+</h2>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                    <FaClock />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Pending Interests
                                    </p>
                                    <h2 className="text-xl font-bold">400+</h2>
                                </div>
                            </div>
                        </div>

                        {/* Work Required */}
                        <h2 className="text-xl font-semibold mb-4">
                            Work Required / Rating
                        </h2>

                        <div className="grid grid-cols-3 px-4 mb-2 text-sm text-gray-500 font-medium">
                            <p>Complaint</p>
                            <p className="text-center">Resident</p>
                            <p className="text-right">Rating</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-xs text-gray-400">
                                            OkTenCom - 1234
                                        </p>
                                        <p className="font-medium">
                                            Meter doesn't work
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <img
                                            src="https://i.pravatar.cc/30"
                                            className="w-8 h-8 rounded-full"
                                            alt="resident"
                                        />
                                        <p className="text-sm">
                                            April Naomie
                                        </p>
                                    </div>

                                    <div className="text-yellow-500 text-lg">
                                        ★★
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Listings */}
                        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl w-full">
                            <h2 className="text-2xl sm:text-3xl text-blue-950 font-semibold mb-6">
                                My Listings
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full">
                                <PropertyCard />
                                <PropertyCard />
                                <PropertyCard />
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default page;