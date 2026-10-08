"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar/index.js";
import { FaHome, FaMoneyBillWave, FaEye, FaClock, FaExclamationCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link"


const page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const propertyId = searchParams.get("propertyId");

    const [profilePercent, setProfilePercent] = useState(100);
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [propertyCount, setPropertyCount] = useState(0);
    const [landlord, setLandlord] = useState(null);
    const [landlordProfile, setLandlordProfile] = useState(null)
    const [tenant, setIsTenant] = useState(null);
    const [tenantProfile, setTenantProfile] = useState(null)
    const [dispute, setDispute] = useState([]);
    const [disputeCount, setDisputeCount] = useState(0);
    const [income, setIncome] = useState([]);
    const [incomeCount, setIncomeCount] = useState(0);
    const [deleteIsDispute, setIsDeleteDispute] = useState([]);

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

    const handleDeleteDispute = async (disputeId) => {
        try {
            const res = await fetch(`/api/dispute?id=${disputeId}`, {
            method: "DELETE",
            credentials: "include",
            });

            const data = await res.json();        

            if (!res.ok) {
                toast.error(data.message || "Failed to delete distpute");
            return;
            }
                toast.success("Dispute deleted successfully")

                //Delete
                setDispute((prev) =>
                prev.filter((item) => item._id !== disputeId)
            );

            } catch (error) {
                console.error("Dispute delete error:", error);
                toast.error("Failed to delete dispute");
            } 
        };

    useEffect(() => {
        const fetchDispute = async () => {
            try {
                const res = await fetch("/api/dispute", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ 
                    disputeNo: disputeCount + 1,
                    property: propertyId,
                    complaint: "Tenant complaint",
                    rating: rating,
                }),
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

    return (
        <>
            <div className="flex min-h-screen w-full bg-gray-100">
                {/* Sidebar (fixed width) */}
                <LandlordDashboardSidebar/>

                {/* Main Content */}
                <div className=" flex-1 p-6 mt-5">
                    {/* Work Required */}
                    <h2 className="text-xl font-semibold mb-4">
                        My Property Complaints
                    </h2>

                    <div className="grid grid-cols-4 px-4 mb-4 text-sm text-gray-500 font-medium justify-space-between">
                        <p>Dispute ID</p>
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
                    <div key={dispute._id}
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

                        <div className="text-yellow-500 text-lg">
                            {dispute?.property}
                        </div>

                        <button
                            type="button"
                            onClick={() => handleDeleteDispute(item._id)}
                            className="text-red-600 font-medium hover:underline cursor-pointer"
                        >
                            <p>Delete</p>
                        </button>

                    </div>
                    )))}
                </div>          
            </div>
        </div>
    </>
)};

export default page;