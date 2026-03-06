"use client";

import React from "react";
import TenantDashboardSidebar from "../../components/tenantDashboardSidebar";
import PropertyCard from "@/components/propertyCard";
import { FaBookmark, FaEnvelope, FaHistory, FaClock } from "react-icons/fa";

const Page = () => {
    return (
        <div className="flex bg-gray-100">
            {/* Sidebar */}
            <TenantDashboardSidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-sm text-gray-500">Mon, 19 2026</p>
                        <h1 className="text-3xl font-bold text-blue-950">
                            Welcome back, Name!
                        </h1>
                        <p className="text-gray-500">
                            This is your dashboard summary report
                        </p>
                    </div>

                    <img
                        src="https://i.pravatar.cc/40"
                        className="w-10 h-10 rounded-full"
                    />
                </div>

                {/* Summary Cards */}
                <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 text-green-600 p-3 rounded-full">
                            <FaBookmark />
                        </div>

                        <div>
                            <p className="text-sm text-blue-950">Saved Homes</p>
                            <h2 className="text-3xl mt-1 font-bold">10</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                            <FaEnvelope />
                        </div>

                        <div>
                            <p className="text-sm text-blue-950">Messages</p>
                            <h2 className="text-3xl mt-1 font-bold">5</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-red-100 text-red-600 p-3 rounded-full">
                            <FaHistory />
                        </div>

                        <div>
                            <p className="text-sm text-blue-950">
                                Property History
                            </p>
                            <h2 className="text-3xl mt-1 font-bold">1</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                            <FaClock />
                        </div>

                        <div>
                            <p className="text-sm text-blue-950 font-medium">
                                Short Let History
                            </p>
                            <h2 className="text-3xl mt-1 font-bold">40</h2>
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="mb-10">
                    <h2 className="text-4xl font-semibold text-blue-950 mb-4">
                        Transactions
                    </h2>

                    <div className="grid grid-cols-6 text-sm font-medium text-gray-500 p-4">
                        <p>ID</p>
                        <p>STATUS</p>
                        <p>PAYMENT</p>
                        <p>DATE</p>
                        <p>AMOUNT</p>
                        <p>PROPERTY</p>
                    </div>
                    <div className=" rounded-xl shadow">
                        {/* Rows */}
                        {[1, 2, 3].map((item) => {
                            const isPending = item === 1;
                            return (
                                <div
                                    key={item}
                                    className="grid grid-cols-6 items-center p-4 text-sm mb-5 bg-white rounded-2xl shadow-sm gap-4">
                                    {/* Profile picture before name */}
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <p>Oluwaseun.O</p>
                                    </div>

                                    {/* Status badge with conditional color */}
                                    <span
                                        className={`px-2 py-1 rounded text-xs w-fit ${
                                            isPending
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                        }`}>
                                        {isPending ? "Pending" : "Successful"}
                                    </span>

                                    <p>7456 - 1234 ****</p>

                                    <p>13 Jun 2024</p>

                                    <p>₦5,000,000</p>

                                    {/* Original image + SLR-102 */}
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                                            alt="Item"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>SLR-102</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-right mt-2 text-sm text-gray-500 cursor-pointer">
                        view all →
                    </div>
                </div>

                {/* Recent Properties */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-4xl font-semibold text-blue-950 mb-6">
                        Recent Properties
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PropertyCard />
                        <PropertyCard />
                        <PropertyCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
