"use client";

import React, { useState, useEffect } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar/index.js";
import PropertyCard from "@/components/propertyCard";
import { FaHome, FaMoneyBillWave, FaEye, FaClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const page = () => {
    const router = useRouter();

    const [profilePercent, setProfilePercent] = useState(100);
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [propertyCount, setPropertyCount] = useState(0);
    const [landlord, setLandlord] = useState(null);
    const [landlordProfile, setLandlordProfile] = useState(null)
    const [tenant, setIsTenant] = useState(null);
    const [tenantProfile, setTenantProfile] = useState(null)
    const [dispute, setDispute] = useState([])


    // Landlord
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch("/api/landlord", {
                method: "GET",
                credentials: "include",
                });
            
                if (!res.ok) {
                toast.error("Failed to fetch landlord");
                return;
                }
            
                const data = await res.json();
                setLandlord(data);
            } catch (err) {
                console.error(err);
                toast.error("Landlord fetch error");
            }
        };
        fetchLandlord();
    }, []);
    
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
        const fetchProperties = async () => {
            try {
                const res = await fetch("/api/property", {
                    credentials: "include",
                    cache: "no-store",
                });

                if (!res.ok) {
                    setProperties([]);
                    return;
                }

                const data = await res.json();

                console.log("PROPERTIES:", data);

                setProperties(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Property fetch error:", err);
                setProperties([]);
            }
        };

        fetchProperties();
    }, []);
        
    //Add Property listing
    useEffect(() => {
        const fetchAddProperty = async () => {
          try {
            const res = await fetch("/api/property", {
              credentials: "include",
            });
    
            if (!res.ok) {
              setPropertyUpload(false);
              return;
            }
    
            const data = await res.json();
            setPropertyUpload(Boolean(data.uploaded));
          } catch (err) {
            console.error(err);
            setPropertyUpload(false);
          } finally {
            setUtilityLoading(false);
          }
        };
    
        fetchAddProperty();
    }, []);


    useEffect(() => {
        const fetchDispute = async () => {
            try {
                const res = await fetch("/api/dispute", {
                method: "GET",
                credentials: "include",
                });
            
                if (!res.ok) {
                toast.error("Failed to fetch dispute");
                return;
                }
            
                const data = await res.json();
                setDispute(data);
            } catch (err) {
                console.error(err);
                toast.error("Dispute fetch error");
            }
        };
        fetchDispute();
    }, []);

    useEffect(() => {
        const fetchCompletion = async () => {
            try {
                const res = await fetch("/api/profile/completion", {
                    credentials: "include",
                });

                if (!res.ok) {
                    setPropertyCount(0);
                    return;
                }

                const data = await res.json();
                setPropertyCount(
                    Number.isFinite(data.percent) ? data.percent : 0
                );
            } catch (err) {
                console.error("Profile completion error:", err);
                setPropertyCount(null);
            }
        };

        fetchCompletion();
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
                                There are currently no complaints. Future tenant or prospective tenant complaint for your property goes here.
                            </p>
                        ) : (
                        dispute.map((dispute) => (
    
                                <div
                                    key={dispute._id}
                                    className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400">
                                            {dispute?.disputeNo}
                                        </p>
                                        <p className="font-medium">
                                            {dispute?.complaint}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <img
                                              src={tenantProfile?.previewPic}
                                            className="w-8 h-8 rounded-full"
                                            alt="resident"
                                        />
                                        <p className="text-sm">{tenant?.firstName} {""} {tenant?.lastName}</p>
                                    </div>

                                    <div className="text-yellow-500 text-lg">
                                        {dispute?.rating}
                                    </div>
                                </div>
                            )
                            ))}
                        </div>

             
                     

                        {/* Listings */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full">
                            <h2 className="text-xl font-semibold mb-4">
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
                                ))
                            )}
                        </div>
                    </div>
                </div>
        </>
    );
};

export default page;