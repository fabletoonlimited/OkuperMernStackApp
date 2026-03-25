"use client";
import React, { useState, useEffect } from "react";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar/index.js";




const Page = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [tenantKyc, setTenantKyc] = useState([]);
    const [landlord, setLandlord] = useState([]);
     const [landlordKyc, setLandlordKyc] = useState([]);

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
    return (
        <div className="">
            <AdminDashboardSidebar/>
            <div className="flex justify-end pr-20 gap-12 bg-blue-900 p-4 mb-6">
                {/* SUBSCRIBERS */}
                <select className="bg-white text-gray-700 rounded px-3 py-2">
                    <option value="">Subscription</option>
                    {subscribers.map((d, i) => (
                        <option key={i}>
                            {d.disputeNo || `DKDen - ${1000 + i}`}
                        </option>
                    ))}
                </select>

                {/* FILTERS */}
                <select className="bg-white text-gray-700 rounded px-3 py-2">
                    <option value="">Role</option>
                    
                </select>

                <select className="bg-white text-gray-700 rounded px-5 py-2">
                    <option value="">Verified</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>

                <select className="bg-white text-gray-700 rounded px-3 py-2">
                    <option value="">Email</option>
                    {landlordKyc.map((u) => (
                        <option key={u.id}>{u.email}</option>
                    ))}
                </select>
            </div>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-5 gap-4 text-gray-400 text-xs mb-3 px-6 py-3 uppercase border-b">
                <div>PROFILE</div>
                <div>IS SUBSCRIBED</div>
                <div>ROLE</div>
                <div>VERIFIED</div>
                <div className="">EMAIL</div>
            </div>

            {/* DATA */}
            {subscribers.map((user) => (
                <div
                    key={landlord.id}
                    className="grid grid-cols-5 items-center bg-white px-5 py-3 mb-2 text-sm">
                    <div className="flex items-center gap-3">
                        <img
                            src={landlordKyc.previewPic}
                            className="w-8 h-8 rounded-full"
                        />
                        <span>
                            {landlord.firstName}
                            {landlord.lastName}
                        </span>
                    </div>

                    <div
                        className={`font-medium ${
                            tenants.isSubscribed
                                ? "text-green-600 bg-gray-300 px-9 w-26 rounded-3xl"
                                : "text-red-600 bg-gray-300 px-9 w-26 rounded-3xl"
                        }`}>
                        {tenants.isSubscribed ? "True" : "False"}
                    </div>
                    <div className="capitalize">{landlordKyc.role}</div>
                    <div>{user.verified ? "Verified" : "Unverified"}</div>
                    <div className="">{landlordKyc.email}</div>
                </div>
            ))}
        </div>
    );
};

export default Page;
