"use client";
import React, { useState, useEffect } from "react";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar/index.js";
import { useSearchParams } from "next/navigation";


const Page = () => {
    const searchParams = useSearchParams();
    const propertyId = searchParams.get("id");
    const [subscribers, setSubscribers] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [tenantKyc, setTenantKyc] = useState([]);
    const [landlord, setLandlord] = useState([]);
    const [landlordKyc, setLandlordKyc] = useState([]);
    const [property, setProperty] = useState([]);

useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const res = await fetch("/api/subscribers");
                const data = await res.json();
                if (!res.ok) return;
                setSubscribers(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSubscribers();
    }, []);

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
    useEffect(() => {
        const fetchTenantKyc = async () => {
            try {
                const res = await fetch("/api/tenantKyc");
                const data = await res.json();
                if (!res.ok) return;
                setTenantKyc(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTenantKyc();
    }, []);

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch("/api/landlord");
                const data = await res.json();
                if (!res.ok) return;
                setLandlord(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLandlord();
    }, []);
    useEffect(() => {
        const fetchLandlordKyc = async () => {
            try {
                const res = await fetch("/api/landlordKyc");
                const data = await res.json();
                if (!res.ok) return;
                setLandlordKyc(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLandlordKyc();
    }, []);
     useEffect(() => {
           
            const fetchProperty = async () => {
                try {
                    const res = await fetch(`/api/property`);
                    if (!res.ok) {
                        toast.error("Failed to load property");
                        return;
                    }
                    const data = await res.json();
                    setProperty(data);
                } catch (err) {
                    console.error("Fetch property error:", err);
                    toast.error("Failed to load property");
                } 
            };
            fetchProperty();
        }, [propertyId]);
    return (
        <div className="">
            <AdminDashboardSidebar />
            <div className="flex justify-end pr-20 gap-12 bg-blue-900 p-4 mb-6">
                {/* SUBSCRIBERS */}
                <select className="bg-white text-gray-700 rounded px-3 py-2">
                    <option value="">Status</option>
                
                </select>

                {/* FILTERS */}
                <select className="bg-white text-gray-700 rounded px-3 py-2">
                    <option value="">Type</option>
                    {property.map((u) => (
                        <option key={u.id}>{u.propertyType}</option>
                    ))}
                </select>

                <select className="bg-white text-gray-700 rounded px-5 py-2">
                    <option value="">Amount</option>
                    {property.map((u) => (
                        <option key={u.id}>{u.price}</option>
                    ))}
                </select>

                <select className="bg-white text-gray-700 rounded px-5 py-2">
                    <option value="">Date</option>
                    {tenants.map((u) => (
                        <option key={u.id}>{u.timestamps}</option>
                    ))}
                </select>

                <select className="bg-white text-gray-700 rounded px-3 py-2">
                    <option value="">Role</option>
                    {tenants.map((u) => (
                        <option key={u.id}>{u.role}</option>
                    ))}
                </select>
            </div>
            <p className="font-semibold text-3xl ml-4">Transactions</p>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-7 gap-4 text-gray-400 text-xs mb-3 px-6 py-3 uppercase border-b">
                <div>ID</div>
                <div>STATUS</div>
                <div>TYPE</div>
                <div>DATE</div>
                <div>AMOUNT</div>
                <div>PROPERTY REF</div>
                <div className="text-right mr-16"> Role</div>
            </div>

            {/* DATA */}
            {tenants.map((user) => (
                <div
                    key={tenants?.id || 1}
                    className="grid grid-cols-7 items-center bg-white px-5 py-3 mb-2 text-sm">
                    <div className="flex items-center gap-3">
                        <img
                            src={tenants?.previewPic }
                            className="w-8 h-8 rounded-full"
                        />
                        <span>
                            {tenants?.firstName
                                || Akpan
                            }
                            {tenants?.lastName || Victor}
                        </span>
                    </div>

                    <div>
                        STATUS
                    </div>
                    <div className="capitalize">{tenants?.type || "Bungalow"}</div>
                    <div>{tenants?.date ||  11/29/20}</div>
                    <div className="">{tenants.Amount}</div>
                    <div>{tenants?.Amount || 20000 }</div>
                    <div className="flex gap-4">
                        <img src={landlord.previewPic || img} alt="yoo" />
                        <span>{landlord?.id || 1234}</span>
                    </div>
                    <div className="text-right mr-16">{tenants?.role || "tenant"}</div>
                </div>
            ))}
        </div>
    );
};

export default Page;
