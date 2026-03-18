"use client";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar/index.js";
import React, { useEffect, useState } from "react";

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

    return (
        <>
            <AdminDashboardSidebar />

            <div className="mt-6 p-12">
                <h2 className="font-semibold mb-4 text-2xl">Disputes</h2>

                {/* Header */}
                <div className="grid grid-cols-5 font-medium text-gray-500 p-3">
                    <span>Dispute No</span>
                    <span>Tenant</span>
                    <span>Complaint</span>
                    <span>Rating</span>
                    <span className="text-center">Delete</span>
                </div>

                {/* Rows */}
                <div className="rounded-lg p-3">
                    {properties.map((tenant, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-5 items-center text-sm py-3 px-3 mb-3 bg-white rounded-lg">
                            <span>DKDen - {1000 + i}</span>

                            <span>{tenant.firstName}</span>

                            <span className="text-gray-500">
                                No complaint yet
                            </span>

                            <span className="text-yellow-500">★★★☆☆</span>

                            <span className="text-center text-red-500 cursor-pointer">
                                Delete
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default page;
