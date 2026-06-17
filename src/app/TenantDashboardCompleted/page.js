"use client";
import React from "react";
import TenantDashboardSidebar from "../../components/tenantDashboardSidebar";
import TrendingRentIndexCarousel from "@/components/trendingRentIndexCarousel"
import PropertyCard from "@/components/propertyCard";
import { FaBookmark, FaEnvelope, FaHistory, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link"


const Page = (_id) => {
    const [tenant, setTenant] = useState(null);
    const [tenantKyc, setTenantKyc] = useState(null);
    const [savedHomesCount, setSavedHomesCount] = useState(null);
    const [messages, setMessages] = useState(null);
    const [disputes, setDisputes] = useState(null);
    const [payment, setPayment] = useState(null);
    const [property, setProperty] = useState(null);


    //Fetch Tenant
    useEffect(() => {
        const fetchTenant = async () => {
            try {
              const res = await fetch("/api/tenant", {
                method: "GET",
                credentials: "include",
              });
    
              if (!res.ok) {
                console.error("Failed to fetch tenant");
                return;
              }
    
              const tenant = await res.json();
              setTenant(tenant);
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
        const kycRes = await fetch("/api/tenantKyc", {
          method: "GET",
          credentials: "include"
        });

        if (!kycRes) {
          toast.error("Failed to fetch tenant KYC");
          return;
        }
        const kycData = await kycRes.json();
        if (kycData) {
          setTenantKyc(kycData);
        }
      }
      catch (err) {
        toast.error("KYC fetch error:", err);
      }
      fetchKyc();
    }}, []);

    //Fetch SavedHomes Count
    useEffect(() => {
        const fetchSavedHomesCount = async () => {
            try {
                const res = await fetch("/api/savedHomes", {
                    method: "GET",
                    credentials: "include",
                });
    
                if (!res.ok) {
                    setSavedHomesCount(null);
                    return;
                }
                const savedHomesData = await res.json();
                setSavedHomesCount(savedHomesData.Number || 0);
            } catch (err) {
                console.error("Saved Homes count error:", err);
                setSavedHomesCount(null);
            }
        };
        fetchSavedHomesCount()
    }, []);

    //Fetch Messages
    useEffect(() => {
        const fetchMessagesCount = async () => {
            try {
                const res = await fetch("/api/message", {
                    method: "GET",
                    credentials: "include",
                });
    
                if (!res.ok) {
                    setMessages(null);
                    return;
                }
                const messageData = await res.json();
                setMessages(messageData.Number || 0);
            } catch (err) {
                console.error("Messages count error:", err);
                setMessages(null);
            }
        };
        fetchMessagesCount()
    }, []);

    //Dispute Count
    useEffect(() => {
        const fetchDisputesCount = async () => {
            try {
                const res = await fetch("/api/disputes", {
                    method: "GET",
                    credentials: "include",
                });
    
                if (!res.ok) {
                    setDisputes(null);
                    return;
                }
                const disputeData = await res.json();
                setDisputes(disputeData.Number || 0);
            } catch (err) {
                console.error("Disputes count error:", err);
                setDisputes(null);
            }
        };
        fetchDisputesCount()
    }, []);

    //Transaction Count
    useEffect(() => {
        const fetchTransactionCount = async () => {
            try {
                const res = await fetch("/api/payment/Xpress", {
                    method: "GET",
                    credentials: "include",
                    body: JSON.stringify({
                        reference,
                        email,
                        amount,
                        status: Pending, Successful, Failed,
                        transactionId
                    })
                });
    
                if (!res.ok) {
                    setPayment(null);
                    return;
                }
                const paymentData = await res.json();
                setPayment(paymentData.Number || 0);
            } catch (err) {
                console.error("Transactions count error:", err);
                setPayment(null);
            }
        };
        fetchTransactionCount()
    }, []);

    //Property
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch("/api/property", {
                    method: "GET",
                    credentials: "include",
                    body: JSON.stringify({
                        previewPic, img1, img2, img3, img4, img5,
                        title, address, state, price, category,
                        unitsAvailable, propertyType, bed, bath,
                        buildingAmenities, propertyAmenities,
                        neighbourhoodPostcode, nearbyPlaces,
                        status: vacant, rented, sold, 
                        rating, listedBy, agent
                    })}
                );
    
                if (!res.ok) {
                    setProperty(null);
                    return;
                }
                const propertyData = await res.json();
                setPayment(propertyData.Number || 0);
            } catch (err) {
                console.error("Property fetch error:", err);
                setProperty(null);
            }
        };
        fetchProperty()
    }, []);


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
                        <h1 className="text-3xl font-bold text-blue-950 mb-2">
                            Welcome back, {tenant?.firstName + " " + tenant?.lastName || "Tenant"}!
                        </h1>
                        <p className="text-gray-500">
                            This is your complete dashboard summary report
                        </p>
                    </div>

                    <img
                        src={tenantKyc?.previewPic || null}
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
                                {savedHomesCount === null
                                ? "0"
                                : `${savedHomesCount}`}
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
                                    {messages === null
                                    ? "0"
                                    : `${messages}`}
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
                                {disputes === null
                                ? "0"
                                : `${disputes}`}   
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                            <FaClock />
                        </div>

                        <div>
                            <p className="text-sm text-blue-950 font-medium">
                                Transaction History
                            </p>
                                <h2 className="text-3xl mt-1 font-bold">
                                {payment === null
                                ? "0"
                                : `${payment}`}   
                                </h2>
                        </div>
                    </div>
                </div>

                {/* Transaction History card*/}
                <div className="mb-10">
                    <h2 className="text-4xl font-semibold text-blue-950 mb-4">
                        Transaction History
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
                        {[payment].map((item) => {
                            // const isPending = item === 1;
                            return (
                                <div key={item}
                                    className="grid grid-cols-6 items-center p-4 text-sm mb-5 bg-white rounded-2xl shadow-sm gap-4">
                                    {/* Profile picture before name */}
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={tenantKyc?.previewPic || null}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <p>Oluwaseun.O</p>
                                    </div>

                                    {/* Status badge with conditional color */}
                                    <span
                                        className={`px-2 py-1 rounded text-xs w-fit ${
                                            payment?.status
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                        }`}>
                                        {/* {isPending ? "Pending" : "Successful"} */}
                                    </span>

                                    <p>{payment?.transactionId || null}</p>

                                    <p>{payment?.timestamps}</p>

                                    <p>{payment?.amount}</p>

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
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-4xl font-semibold text-blue-950 mb-6">
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
