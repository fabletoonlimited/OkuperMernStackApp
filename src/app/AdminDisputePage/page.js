"use client";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar/index.js";
import React, { useEffect, useState } from "react";

const Page = () => {
    const [tenants, setTenants] = useState([]);
    const [disputes, setDisputes] = useState([]);

    // fetch tenants
    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const res = await fetch("/api/tenants");
                const data = await res.json();
                if (!res.ok) return;
                setTenants(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTenants();
    }, []);

    // fetch disputes
    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                const res = await fetch("/api/disputes"); // ensure endpoint is correct
                const data = await res.json();
                if (!res.ok) return;
                setDisputes(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDisputes();
    }, []);

    // helper: optionally find tenant by ID when rendering
    const findTenantName = (tenantId) => {
        const tenant = tenants.find((t) => t.id === tenantId);
        return tenant ? `${tenant.firstName} ${tenant.lastName}` : "Unknown";
    };

    return (
        <>
            <AdminDashboardSidebar />

            {/* Filter Bar */}
            <div className="flex justify-end pr-20 gap-6 bg-blue-900 p-4 mb-6">
                <select
                    name="disputeNo"
                    className="bg-white text-gray-700 rounded px-3 py-2">
                    <option value="">Dispute No.</option>
                    {disputes.map((d, i) => (
                        <option key={i} value={d.disputeNo || ""}>
                            {d.disputeNo || `DKDen - ${1000 + i}`}
                        </option>
                    ))}
                </select>

                <select
                    name="tenantName"
                    className="bg-white text-gray-700 rounded px-3 py-2">
                    <option value="">Tenant Name</option>
                    {tenants.map((t, i) => (
                        <option key={i} value={t.id}>
                            {t.firstName} {t.lastName}
                        </option>
                    ))}
                </select>

                <select
                    name="rating"
                    className="bg-white text-gray-700 rounded px-5 py-2">
                    <option value="">Rating</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                </select>

                <select
                    name="property"
                    className="bg-white text-gray-700 rounded px-3 py-2">
                    <option value="">Property</option>
                    <option value="apt1">Apartment 1</option>
                    <option value="apt2">Apartment 2</option>
                    <option value="apt3">Apartment 3</option>
                </select>
            </div>
               <div className="px-12">
            <h2 className="font-semibold mb-4 text-2xl p-6">Disputes</h2>

            {/* Header */}
            <div className="grid grid-cols-6 font-medium text-gray-500 p-6">
                <span>Dispute No</span>
                <span>Tenant</span>
                <span>Complaint</span>
                <span>Rating</span>
                <span>Properties</span>
                
            </div>

            {/* Rows */}
            <div className="mt-6 p-12">
                {disputes.map((d, i) => {
                    // find the tenant that matches this dispute
                    const tenant = tenants.find((t) => t.id === d.tenantId);
                    const shortId = d.id ? d.id.slice(0, 8) : ""; 
                    return (
                        <div
                            key={i}
                            className="grid grid-cols-6 items-center text-sm py-3 px-3 mb-3 bg-white rounded-lg shadow">
                            {/* dispute no */}
                            <span>{d.disputeNo || `DKDen - ${1000 + i}`}</span>

                            {/* tenant name, if found */}
                            <span>
                                {tenant
                                    ? `${tenant.firstName} ${tenant.lastName}`
                                    : "Unknown"}
                            </span>

                            {/* complaint */}
                            <span className="text-gray-500">
                                {d.complaint || ""}
                            </span>

                            {/* rating */}
                            <span className="text-yellow-500">
                                {d.rating
                                    ? "★".repeat(Math.floor(d.rating))
                                    : "★★★☆☆"}
                            </span>

                            {/* property */}
                            <div className="flex gap-4">
                                <img src={tenant.previewPic} alt="yoo" />
                                <span>{shortId}</span>
                            </div>

                            {/* delete */}
                            <span className="text-center text-red-500 cursor-pointer">
                                Delete
                            </span>
                        </div>
                    );
                })}
                </div>
            </div>
        </>
    );
};

export default Page;
