"use client";

import React, { useState, useEffect } from "react";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar/index.js";
import { FaHome, FaMoneyBillWave, FaEye, FaClock } from "react-icons/fa";
import AllProperties from "@/app/dashboardAdminAllProperties/page.js"; // Updated import

const page = () => {
    const [properties, setProperties] = useState([]);
    
        useEffect(() => {
            const fetchProperty = async () => {
                try {
                    const res = await fetch("/api/models/tenantModels");
                    const data = await res.json();
                    if (!res.ok) return;
                    setProperties(data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchProperty();
        }, []);

     const [property, setProperty] = useState([]);
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
                    setProperty(data);
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
    
    return (
        <div className="flex min-h-screen w-full bg-gray-100">
            <AdminDashboardSidebar />

            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-blue-950">Mon, 18 2026</p>
                        <h1 className="text-2xl font-bold">
                            Welcome back, Admin!
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
                            <h2 className="text-xl font-bold">
                                {property.length}
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                        <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                            <FaMoneyBillWave />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">
                                Total Commision
                            </p>
                            <h2 className="text-xl font-bold">N33M</h2>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                        <div className="bg-red-100 p-3 rounded-full text-red-600">
                            <FaEye />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <h2 className="text-xl font-bold">84K+</h2>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <FaClock />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">
                                Total Complaints
                            </p>
                            <h2 className="text-xl font-bold">
                                {property.length}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Disputes Table */}
                <div className="mt-6 p-12">
                    <h2 className="font-semibold mb-4 text-2xl">Disputes</h2>

                    <div className="grid grid-cols-4 font-medium text-gray-500 p-3">
                        <span>Dispute No</span>
                        <span>Resident</span>
                        <span>Complaint</span>
                        <span>Rating</span>
                    </div>

                    <div className="rounded-lg p-3">
                        {properties.map((tenant, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-4 items-center text-sm py-3 px-3 mb-3 last:mb-0 bg-white rounded-lg">
                                <span>{tenant.id}</span>
                                <span>{tenant.resident}</span>
                                <span className="text-gray-500">
                                    {tenant.complaint}
                                </span>
                                <span className="text-yellow-500">
                                    {"★".repeat(tenant.rating)}
                                    {"☆".repeat(5 - tenant.rating)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-2">
                        <a
                            href="/AdminDisputePage"
                            className="text-gray-700 font-medium hover:underline flex items-center gap-1">
                            View All <span className="text-lg">→</span>
                        </a>
                    </div>
                </div>

                {/* Listings */}
                <div className="p-6 sm:p-8 md:p-10 rounded-3xl w-full">
                    <AllProperties/>
                </div>
            </div>
        </div>
    );
};

export default page;
