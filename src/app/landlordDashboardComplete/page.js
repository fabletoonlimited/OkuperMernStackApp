"use client";

import React, { useState, useEffect } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar/index.js";
import PropertyCard from "@/components/propertyCard";
import { FaHome, FaMoneyBillWave, FaEye, FaClock, FaExclamationCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const page = () => {
    const router = useRouter();

    const [profilePercent, setProfilePercent] = useState(100);
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [propertyCount, setPropertyCount] = useState(0);
    const [homeInterests, setHomeInterests] = useState([]);
    const [homeInterestCount, setHomeInterestCount] = useState(0);
    const [landlord, setLandlord] = useState(null);
    const [landlordProfile, setLandlordProfile] = useState(null)
    const [tenant, setIsTenant] = useState(null);
    const [tenantProfile, setTenantProfile] = useState(null)
    const [dispute, setDispute] = useState([]);
    const [disputeCount, setDisputeCount] = useState(0);
    const [income, setIncome] = useState([]);
    const [incomeCount, setIncomeCount] = useState(0);

    useEffect(() => {
    if (!landlord?._id) return;

    const fetchProperties = async () => {
        try {
            const res = await fetch(
                `/api/property?landlordId=${landlord._id}`,
                {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                console.error("Property fetch failed:", data);
                setProperties([]);
                setPropertyCount(0);
                return;
            }

            console.log("LOGGED-IN LANDLORD:", landlord._id);
            console.log("LANDLORD PROPERTIES:", data);

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.properties)
                ? data.properties
                : [];

            setProperties(list);
            setPropertyCount(list.length);

        } catch (error) {
            console.error("Property fetch error:", error);
            setProperties([]);
            setPropertyCount(0);
        }
    };

        fetchProperties();
    }, [landlord?._id]);
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/landlordProfile/upload", {
                    method: "GET",
                    credentials: "include",
                });
    
                if (!res.ok) {
                    toast.error("Failed to load landlord profile");
                    return;
                }
    
                const data = await res.json();        
                console.log(data); 
                setLandlordProfile(data);

            } catch (err) {
                console.error("Profile fetch error:", err);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
    
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const res = await fetch("/api/tenant", {
                method: "GET",
                credentials: "include",
                });
            
                if (!res.ok) {
                toast.error("Failed to fetch tenant");
                return;
                }
            
                const data = await res.json();
                setIsTenant(data);
            } catch (err) {
                console.error(err);
                toast.error("Tenant fetch error");
            }
        };
        fetchTenant();
    }, []);

    useEffect(() => {
        const fetchTenantProfile = async () => {
            try {
                const res = await fetch("/api/tenantProfile/upload", {
                    method: "GET",
                    credentials: "include",
                });
    
                if (!res.ok) {
                    toast.error("Failed to load tenant profile");
                    return;
                }
    
                const data = await res.json();        
                console.log(data); 
                setTenantProfile(data);
    
            } catch (err) {
                console.error("Profile fetch error:", err);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
    
        fetchTenantProfile();
    }, []);

    useEffect(() => {
    const fetchMyProperties = async () => {
        try {
            // First get the logged-in landlord
            const landlordRes = await fetch("/api/landlord", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            if (!landlordRes.ok) {
                console.error("Failed to fetch landlord");
                setProperties([]);
                setPropertyCount(0);
                return;
            }

            const landlordData = await landlordRes.json();

            console.log("LOGGED IN LANDLORD:", landlordData);
            console.log("LANDLORD ID:", landlordData._id);

            if (!landlordData?._id) {
                console.error("No landlord ID found");
                setProperties([]);
                setPropertyCount(0);
                return;
            }

            // Now fetch ONLY this landlord's properties
            const propertyRes = await fetch(
                `/api/property?landlordId=${landlordData._id}`,
                {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                }
            );

            const propertyData = await propertyRes.json();

            console.log("MY LANDLORD PROPERTY RESPONSE:", propertyData);

            if (!propertyRes.ok) {
                setProperties([]);
                setPropertyCount(0);
                return;
            }

            const list = Array.isArray(propertyData)
                ? propertyData
                : propertyData?.properties || [];

            setProperties(list);
            setPropertyCount(list.length);

            console.log("PROPERTY COUNT:", list.length);

        } catch (error) {
            console.error("PROPERTY FETCH ERROR:", error);
            setProperties([]);
            setPropertyCount(0);
        }
    };

    fetchMyProperties();
}, []);

    useEffect(() => {
        const fetchDispute = async () => {
            try {
                const res = await fetch("/api/dispute", {
                method: "GET",
                credentials: "include",
                });
            
                if (!res.ok) {
                    setDispute([]);
                    setDisputeCount(0);
                    toast.error("Failed to fetch dispute")
                return;
                }
                const data = await res.json();

                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.disputes)
                    ? data.disputes
                    : [];
                setDispute(list);
                setDisputeCount(list.length);

            } catch (err) {
                setDispute([]);
                setDisputeCount(0);

                console.error(err);
                toast.error("Dispute fetch error");
            }
        };
        fetchDispute();
    }, []);

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const res = await fetch("/api/payment", {
                method: "GET",
                credentials: "include",
                cache: "no-store"
                });

                const data = await res.json();
            
                if (!res.ok) {
                    console.log("Payment fetch failed:", data);
                    setIncome([]);
                    setIncomeCount(0);
                    return;
                }
                console.log("PAYMENTS:", data);

                const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.payments)
                ? data.payments
                : [];

                setIncome(list);
                setIncomeCount(list.length);

            console.log("INCOME COUNT:", list.length);

        } catch (err) {
            console.error("Payment fetch error:", err);
            setIncome([]);
            setIncomeCount(0);
        }
    };

    fetchIncome();
}, []);

useEffect(() => {
    const fetchHomeInterests = async () => {
        try {
            const res = await fetch("/api/homeInterest", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                setHomeInterests([]);
                setHomeInterestCount(0);
                toast.error(data?.message || "Failed to fetch home interests");
                return;
            }

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.interests)
                ? data.interests
                : [];

            setHomeInterests(list);
            setHomeInterestCount(list.length);
        } catch (err) {
            setHomeInterests([]);
            setHomeInterestCount(0);
            toast.error("Home interests fetch error");
        }
    };

    fetchHomeInterests();
}, []);

    return (
        <>
            <div className="flex min-h-screen w-full bg-gray-100">
                {/* Sidebar (fixed width) */}
                <LandlordDashboardSidebar/>

                {/* Main Content */}
                <div className=" flex-1 p-6 mt-5">
                        
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-sm text-blue-950">
                                {new Date().toLocaleDateString()}
                            </p>
                            <h1 className="text-2xl font-bold">
                                Welcome, 
                                    {
                                    landlord
                                    ?`${landlord.firstName} ${landlord?.lastName }` 
                                    : "Landlord"
                                }!
                            </h1>
                            <p className="text-blue-950">
                                This is your new dashboard summary report.
                            </p>
                        </div>

                        <img
                            src={landlordProfile?.previewPic}
                            className="w-10 h-10 rounded-full"
                            alt="landdlordrofilePic"
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
                                    <h2 className="text-xl font-bold">{propertyCount}</h2>
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
                                    <h2 className="text-xl font-bold">{incomeCount}</h2>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                                <div className="bg-red-100 p-3 rounded-full text-red-600">
                                    <FaExclamationCircle />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Total Property Disputes
                                    </p>
                                    <h2 className="text-xl font-bold">{disputeCount}</h2>
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
                                    <h2 className="text-xl font-bold">{homeInterestCount}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Work Required */}
                        <h2 className="text-xl font-semibold mb-4">
                            My Property Complaints
                        </h2>

                    <div className="grid grid-cols-3 px-4 mb-2 text-sm text-gray-500 font-medium">
                        <p>Complaint</p>
                        <p className="text-center">Resident</p>
                        <p className="text-right">Rating</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        {dispute.length === 0 ? (
                            <p className="text-gray-500 text-center py-6">
                                There are currently no complaints. Future tenant or
                                prospective tenant complaints for your property goes here.
                            </p>
                            ) : (
                        <>
                        {dispute.slice(0, 4).map((item) => (
                        <div
                            key={item._id}
                            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                        >
                        {/* Complaint */}
                        <div>
                            <p className="text-xs text-gray-400">
                                {item?.disputeNo}
                            </p>

                            <p className="font-medium">
                                {item?.complaint}
                            </p>
                        </div>

                        {/* Resident */}
                        <div className="flex items-center gap-2">
                            <img
                                src={tenantProfile?.previewPic}
                                className="w-8 h-8 rounded-full"
                                alt="resident"
                            />

                            <p className="text-sm">
                                {item?.firstName} {item?.lastName}
                            </p>
                        </div>

                        {/* Rating */}
                        <div className="text-yellow-500 text-lg">
                            {item?.rating}
                        </div>
                    </div>
                    ))}

                    {/* View All */}
                    {dispute.length > 4 && (
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => router.push("/landlordDispute")}
                                className="text-blue-700 font-semibold hover:underline cursor-pointer"
                            >
                                View All
                            </button>
                        </div>
                    )}
                    </>
                    )}
                    </div>

                    {/* Listings */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full pb-10">
                        <h2 className="text-xl font-semibold mb-4 col-span-full">
                            My Property Listings
                        </h2>

                        {properties.length === 0 ? (
                        <p className="text-gray-500 col-span-full text-center py-10">
                            You currently have no property listings. Future Property Listings goes here
                        </p>
                        ) : (
                        properties.map((property) => (
                            <PropertyCard
                            key={property._id}
                            {...property}
                            />
                        )))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default page;