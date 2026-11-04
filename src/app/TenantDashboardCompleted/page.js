"use client";
import React from "react";
import TenantDashboardSidebar from "../../components/tenantDashboardSidebar";
import TrendingRentIndexCarousel from "@/components/trendingRentIndexCarousel"
import PropertyCard from "@/components/propertyCard";
import { FaBookmark, FaEnvelope, FaHistory, FaClock, FaCashRegister } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link"


const Page = (_id) => {
const [tenant, setTenant] = useState(null);
const [tenantKyc, setTenantKyc] = useState(null);
const [tenantProfile, setTenantProfile] = useState(null);

const [savedHomesCount, setSavedHomesCount] = useState(0);
const [messages, setMessages] = useState(0);
const [disputes, setDisputes] = useState(0);
const [transactions, setTransactions] = useState([]);
const [property, setProperty] = useState([]);

const [loading, setLoading] = useState(true);

const getItems = (data, possibleKeys) => {
    if (Array.isArray(data)) return data;

    for (const key of possibleKeys) {
        if (Array.isArray(data?.[key])) {
            return data[key];
        }
    }

    return [];
};

    useEffect(() => {
    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/tenantProfile/upload", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            if (!res.ok) throw new Error("Failed to load tenant profile");

            const data = await res.json();
            setTenantProfile(data);

        } catch (err) {
            console.error("Profile fetch error:", err);
        }
    };

    fetchProfile();
}, []);

    //Fetch Tenant
   // Fetch Tenant
useEffect(() => {
    const fetchTenant = async () => {
        try {
            const res = await fetch("/api/tenant", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch tenant");
            }

            const data = await res.json();
            setTenant(data);

        } catch (err) {
            console.error("Tenant fetch error:", err);
        }
    };

    fetchTenant();
}, []);

    //Tenant KYC
   useEffect(() => {
    const fetchKyc = async () => {
        try {
            const res = await fetch("/api/tenantKyc", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            if (!res.ok) throw new Error("Failed to fetch tenant KYC");

            const data = await res.json();
            setTenantKyc(data);

        } catch (err) {
            console.error("KYC fetch error:", err);
        }
    };

        fetchKyc();
    }, []);

    //Fetch SavedHomes Count
    useEffect(() => {
        const fetchSavedHomesCount = async () => {
            try {
                const res = await fetch("/api/favorites", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store"
                });
    
                if (!res.ok) throw new Error("Failed to fetch saved homes");

            const data = await res.json();

            const favorites = getItems(data, ["favorites"]);

            // Count unique properties
            const uniqueProperties = new Set(
                favorites
                    .map(item => item.propertyId?._id || item.propertyId)
                    .filter(Boolean)
                    .map(id => id.toString())
            );

            setSavedHomesCount(uniqueProperties.size);

        } catch (err) {
            console.error("Saved homes count error:", err);
            setSavedHomesCount(0);
        }
    };

        fetchSavedHomesCount();
    }, []);

    // Fetch Messages Count
    useEffect(() => {
        const fetchMessagesCount = async () => {
            try {
                const res = await fetch("/api/message", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.error || data.message || "Failed to fetch messages"
                    );
                }

                // Your backend returns conversations, not messages
                const conversations = data.conversations || [];

                setMessages(conversations.length);

            } catch (err) {
                console.error("Messages count error:", err);
                setMessages(0);
            }
        };

        fetchMessagesCount();
    }, []);

    //Dispute Count
    useEffect(() => {
    const fetchDisputesCount = async () => {
        try {
            const res = await fetch("/api/disputes", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            if (!res.ok) throw new Error("Failed to fetch disputes");

            const data = await res.json();

            const disputeList = getItems(data, ["disputes", "data"]);

            setDisputes(
                typeof data.Number === "number"
                    ? data.Number
                    : disputeList.length
            );

        } catch (err) {
            console.error("Disputes count error:", err);
            setDisputes(0);
        }
    };

        fetchDisputesCount();
    }, []);

    //Transaction Count
    useEffect(() => {
    const fetchTransactionCount = async () => {
        try {
            const res = await fetch("/api/payment/xPress", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            if (!res.ok) throw new Error("Failed to fetch transactions");

            const data = await res.json();

            const transactionList = getItems(data, [
                "payments",
                "transactions",
                "data",
            ]);

            setTransactions(transactionList);

        } catch (err) {
            console.error("Transactions count error:", err);
            setTransactions([]);
        }
    };

        fetchTransactionCount();
    }, []);

    //Property
   useEffect(() => {
    const fetchProperties = async () => {
        try {
            const res = await fetch("/api/property", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            if (!res.ok) throw new Error("Failed to fetch properties");

            const data = await res.json();

            setProperty(
                getItems(data, ["properties", "property", "data"])
            );

        } catch (err) {
            console.error("Property fetch error:", err);
            setProperty([]);
        }
    };

        fetchProperties();
    }, []);


    return (
        <div className="flex bg-gray-100">
            {/* Sidebar */}
            <TenantDashboardSidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-linear-to-r from-blue-900 to-blue-700 p-7">
                    <div>
                        <p className="text-sm text-white">Mon, 19 2026</p>
                        <h1 className="font-bold md:text-5xl text-white text-2xl">
                            Dear, {}
                            {tenant
                            ? `${tenant.firstName} ${tenant?.lastName}`
                            : "Tenant"}
                            !
                        </h1>
                        <p className="text-white">
                            This is your complete dashboard summary report
                        </p>
                    </div>

                    <img
                        src={tenantProfile?.previewPic || null}
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
                            <h2 className="text-3xl mt-1 font-bold">
                                {savedHomesCount}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                            <FaEnvelope />
                        </div>

                        <div>
                            <p className="text-sm text-blue-950">Messages</p>
                                <h2 className="text-3xl mt-1 font-bold">
                                    {messages}
                                </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-red-100 text-red-600 p-3 rounded-full">
                            <FaHistory />
                        </div>

                        <div> 
                            
                            <p className="text-sm text-blue-950">
                                Disputes
                            </p>
                            <h2 className="text-3xl mt-1 font-bold">
                                {disputes}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                                <FaCashRegister />
                            </div>
                        <div>
                            <p className="text-sm text-blue-950 font-medium">
                                Transaction History
                            </p>

                            <h2 className="text-3xl mt-1 font-bold">
                                {transactions.length}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Transaction History card*/}
                <div className="mb-10">
                    <h2 className="text-4xl font-semibold text-blue-950 mb-4">
                        Transaction History
                    </h2>

                    <div className="md:gap-50 flex gap-1.5 text-sm font-medium text-gray-500 p-1">
                        <p>ID</p>
                        <p>STATUS</p>
                        <p>PAYMENT</p>
                        <p>DATE</p>
                        <p>AMOUNT</p>
                        <p>PROPERTY</p>
                    </div>
                    <div className="rounded-xl shadow">
                        {/* Rows */}
                        {[transactions].map((item) => {
                            // const isPending = item === 1;
                            return (
                                <div key={item}
                                    className="md:overflow-x-hidden overflow-x-scroll grid grid-cols-6 items-center p-4 text-sm mb-5 bg-white rounded-2xl shadow-sm gap-4">
                                    {/* Profile picture before name */}
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={tenantProfile?.previewPic || null}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <p className="text-blue-950">{tenantProfile?.firstName} {""} {tenantProfile?.lastName}</p>
                                    </div>

                                    {/* Status badge with conditional color */}
                                    <span
                                        className={`px-2 py-1 rounded text-xs w-fit ${
                                            transactions?.status
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                        }`}>
                                        {/* {isPending ? "Pending" : "Successful"} */}
                                    </span>

                                    <p>{transactions?.transactionId || null}</p>

                                    <p>{transactions?.timestamps}</p>

                                    <p>{transactions?.amount}</p>

                                    {/* Original image + SLR-102 */}
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={property?.previewPic}
                                            alt="Item"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{property?.transactionId}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* <Link href={`/property?id=${_id}`}> 
                        <span className="text-right mt-2 text-sm text-gray-500 cursor-pointer">
                            view all →
                        </span>
                    </Link> */}
                </div>

                {/* Recent Properties */}
                <div className="bg-white rounded-xl shadow">
                    <h2 className="text-4xl font-semibold text-blue-950 p-4">
                        Recent Properties
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* {/* <PropertyCard /> */}
                       <TrendingRentIndexCarousel />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
