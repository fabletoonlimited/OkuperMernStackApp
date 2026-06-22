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
import { toast } from "react-toastify";

function landlordDashboard() {
    const router = useRouter();
    
    const [isOpen, setIsOpen] = useState(false);
    const [checking, setChecking] = useState(false);

    const [profilePercent, setProfilePercent] = useState(100);
    const [bankCompletion, setBankCompletion] = useState(false);
    const [utilityCompletion, setUtilityCompletion] = useState(false);
    const [utilityLoading, setUtilityLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [landlord, setLandlord] = useState(null);
    
    // landlord state
    const [landlordEmail, setLandlordEmail] = useState(null);;
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


      // Utility
      useEffect(() => {
        const fetchCompleteUtility = async () => {
          try {
            const res = await fetch("/api/uploads/utilityBill", {
              credentials: "include",
            });
    
            if (!res.ok) {
              setUtilityCompletion(false);
              return;
            }
    
            const data = await res.json();
            setUtilityCompletion(Boolean(data.uploaded));
          } catch (err) {
            console.error(err);
            setUtilityCompletion(false);
          } finally {
            setUtilityLoading(false);
          }
        };
    
        fetchCompleteUtility();
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



    if (profilePercent === 100 && utilityCompletion) {
        return (
          <>
            <LandlordDashboardComplete />
            <LandlordDashboardFooter />
          </>
        );
      }
    
      if (profilePercent === null || utilityLoading) {
        return <LandlordDashboardFooter />;
    }
    
    
    return (
        <>
            <div className="flex bg-gray-100">
               {profilePercent && utilityCompletion && bankCompletion === 100 && (<LandlordDashboardComplete />) }
                {profilePercent && utilityCompletion && !bankCompletion !== null &&  (
      
                <div className="flex min-h-screen bg-gray-100">
                    <LandlordDashboardSidebar />
                    <div className="flex-1">

                        {/* Top Nav Section*/}
                        <div className="landlordDashboardWelcomeMessage mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                            <h1 className="font-bold md:text-5xl text-2xl pl-7">
                                Welcome, {landlord?.firstName + " " + landlord?.lastName || "Landlord"}!
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
              <LandlordDashboardFooter />
        </>
    );
}

export default landlordDashboard;
