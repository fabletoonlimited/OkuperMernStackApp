"use client"
import React from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar/index.js";
import LandlordDashboardCard from "../../components/landlordDashboardCard/index.js";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter/index.js";
import { FaHome, FaMoneyBillWave, FaEye, FaClock } from "react-icons/fa";
import { FaExclamationCircle, FaStar } from "react-icons/fa";
import PropertyCard from "@/components/propertyCard";
import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import SubscriptionModal2 from "../../components/subscriptionModal2";
import { useRouter } from "next/navigation";
import LandlordDashboardComplete from "../landlordDashboardComplete/page.js";
function landlordDashboard() {
    const router = useRouter();
    
    const [isOpen, setIsOpen] = useState(false);
    const [checking, setChecking] = useState(false);
    const [profilePercent, setProfilePercent] = useState(100);
    
    // landlord state
    const [landlordEmail, setLandlordEmail] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [propertyCount, setPropertyCount] = useState(0);
    
    // ✅ get logged in landlord
    useEffect(() => {
        const getMe = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    cache: "no-store",
                });
    
                const data = await res.json();
    
                if (!res.ok) return;
    
                // adjust depending on your response shape
                const email = data?.user?.email || data?.email;
                setLandlordEmail(email || null);
            } catch (err) {
                console.error("Auth me error:", err);
            }
        };
    
        getMe();
    }, []);
    
    useEffect(() => {

        const fetchCompletion = async () => {
            try {
                const res = await fetch("/api/profile/completion", {
                    credentials: "include",
                });
    
                if (!res.ok) {
                    setProfilePercent(null);
                    return;
                }
    
                const data = await res.json();
                setProfilePercent(
                    Number.isFinite(data.percent) ? data.percent : 0,
                );
            } catch (err) {
                console.error("Profile completion error:", err);
                setProfilePercent(null);
            }
        };
    
        fetchCompletion();
    }, []);
    
    // ✅ fetch subscription + property count once we have landlord email
    useEffect(() => {
        if (!landlordEmail) return;
    
        const fetchSubscriptionAndProperties = async () => {
            try {
                // 1) subscription
                const subRes = await fetch("/api/landlordSubscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "check",
                        email: landlordEmail,
                        cardNo: "0000",
                        cvv2: "000",
                        expDate: "00/00",
                    }),
                });
    
                const subData = await subRes.json();
    
                if (subRes.ok) {
                    setIsSubscribed(subData?.subscribed === true);
                }
    
                // 2) properties
                const propRes = await fetch("/api/property", {
                    method: "GET",
                    cache: "no-store",
                });
    
                const propData = await propRes.json();
    
                if (propRes.ok) {
                    const all = propData?.properties || [];
    
                    // only count properties uploaded by this landlord
                    const mine = all.filter(
                        (p) =>
                            p?.landlord?.email === landlordEmail ||
                            p?.landlordEmail === landlordEmail,
                    );
    
                    setPropertyCount(mine.length);
                }
            } catch (err) {
                console.error("Fetch subscription/properties error:", err);
            }
        };
    
        fetchSubscriptionAndProperties();
    }, [landlordEmail]);
    
    // ✅ this is what controls upload access
    const handleUploadClick = async (e) => {
        e.preventDefault();
    
        if (checking) return;
        setChecking(true);
    
        try {
            // if not subscribed and already uploaded 1 property -> block
            if (!isSubscribed && propertyCount >= 1) {
                setIsOpen(true);
                return;
            }
    
            // allowed
            router.push("/propertyListingLanding");
        } finally {
            setChecking(false);
        }
    };
    
    return (
        <>
            <div className="flex bg-gray-100">
                {profilePercent == 15 && (
            <LandlordDashboardComplete />
                )}

            {profilePercent === 100 && (
                <div className="flex min-h-screen bg-gray-100">
                    <LandlordDashboardSidebar />
                    <div className="flex-1">
                        {/* Top Nav Section*/}

                        <div className="landlordDashboardWelcomeMessage mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                            <h1 className="font-bold md:text-5xl text-2xl pl-7">
                                Welcome, Landlord!
                            </h1>
                            <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
                                We are thrilled that you have chosen to list
                                your property with Okuper.
                            </p>
                        </div>

                        {/* Dashboard Section*/}
                        <div className="landlordDashboardNextSteps md:mt-8 md:px-20 px-0">
                            <h3 className="font-medium md:text-4xl text-2xl pl-7">
                                Your next steps
                            </h3>
                            <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
                                In other to complete your profile and listing,
                                there are a few things left to do.
                            </p>
                        </div>

                        <div className="md:px-16 px-0">
                            <LandlordDashboardCard />
                        </div>
                    </div>
                </div>
            )}
                
            </div>
        </>
    );
}

// landlordDashboard.getLayout = function getLayout(page) {
//     return {page};
//   };

export default landlordDashboard;
