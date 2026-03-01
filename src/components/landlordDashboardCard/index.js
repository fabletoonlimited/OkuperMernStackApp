"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import SubscriptionModal2 from "../../components/subscriptionModal2";
import { useRouter } from "next/navigation";
import { FaHome, FaMoneyBillWave, FaEye, FaClock } from "react-icons/fa";
import { FaExclamationCircle, FaStar } from "react-icons/fa";
import PropertyCard from "@/components/propertyCard";

const index = () => {
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
            {profilePercent === 100 && (
                <div className=" bg-gray-100 p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-sm text-blue-950">
                                Mon, 18 2026
                            </p>
                            <h1 className="text-2xl font-bold">
                                Welcome back, Name!
                            </h1>
                            <p
                                className="text-blue
                              -950">
                                This is your dashboard summary report
                            </p>
                        </div>

                        <img
                            src="https://i.pravatar.cc/40"
                            className="w-10 h-10 rounded-full"
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
                        Work Required / Rating
                    </h2>
                    {/* Header Row */}
                    <div className="grid grid-cols-3 px-4 mb-2 text-sm text-gray-500 font-medium">
                        <p>Complaint</p>
                        <p className="text-center">Resident</p>
                        <p className="text-right">Rating</p>
                    </div>
                    <div className="space-y-4 mb-8">
                        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                            {/* LEFT - Complaint */}
                            <div>
                                <p className="text-xs text-gray-400">
                                    OkTenCom - 1234
                                </p>
                                <p className="font-medium">
                                    Sink wasn't installed
                                </p>
                            </div>

                            {/* CENTER - Resident */}
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://i.pravatar.cc/30"
                                    className="w-8 h-8 rounded-full"
                                />
                                <p className="text-sm">April Naomie</p>
                            </div>

                            {/* RIGHT - Rating */}
                            <div className="text-yellow-500 text-lg">★★★</div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400">
                                    OkTenCom - 1234
                                </p>
                                <p className="font-medium">
                                    Meter doesn't work
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <img
                                    src="https://i.pravatar.cc/30"
                                    className="w-8 h-8 rounded-full"
                                />
                                <p className="text-sm">April Naomie</p>
                            </div>

                            <div className="text-yellow-500 text-lg">★★</div>
                        </div>
                    </div>
                    {/* Listings */}
                    <div className="bg-white p-10 rounded-3xl">
                        <h2 className="text-3xl text-blue-950 font-semibold mb-4">
                            My Listings
                        </h2>

                        <div className="">
                            <div className="flex justify-center ">
                                <div className="grid grid-cols-3 gap-24">
                                    <PropertyCard />
                                    <PropertyCard />
                                    <PropertyCard />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {profilePercent !== 100 && (
                <div className="md:mt-10 p-4 md:px-12">
                    <div className="landlordDashboardCard grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profilePercent !== 100 && (
                            <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
                                <h4 className="text-blue-950 font-bold mb-3">
                                    Your Profile
                                </h4>

                                <p>
                                    {profilePercent === null
                                        ? "Your profile information is loading"
                                        : `Your profile information is ${profilePercent}% complete`}
                                </p>

                                <Link href="/verification">
                                    <div className="flex justify-center">
                                        <button className="bg-blue-900 rounded-xl px-6 py-2 w-full text-white text-sm mt-6 hover:bg-blue-800 transition">
                                            Update Your Profile
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Listings */}
                        {profilePercent !== 100 && (
                            <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
                                <h4 className="text-blue-950 font-bold mb-3">
                                    Listings
                                </h4>

                                <p>
                                    Add your property listings to showcase it to
                                    tenants
                                </p>

                                <div className="flex justify-center">
                                    <button
                                        onClick={handleUploadClick}
                                        className="bg-blue-900 rounded-xl px-6 py-2 w-full text-white text-sm mt-6 hover:bg-blue-800 transition">
                                        Add Listing
                                    </button>
                                </div>

                                <SubscriptionModal2
                                    isOpen={isOpen}
                                    onClose={() => setIsOpen(false)}
                                />
                            </div>
                        )}

                        {/* Address Verification */}
                        {profilePercent !== 100 && (
                            <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
                                <h4 className="text-blue-950 font-bold mb-3">
                                    Address Verification
                                </h4>

                                <p>
                                    Verify your listing by providing the
                                    required documentation
                                </p>

                                <Link href="/verification">
                                    <div className="flex justify-center">
                                        <button className="bg-blue-900 rounded-xl px-6 py-2 w-full text-white text-sm md:mt-6 hover:bg-blue-800 transition">
                                            Verify Your Address
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        )}
                        {/* Profile Picture */}
                        {profilePercent !== 100 && (
                            <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
                                <h4 className="text-blue-950 font-bold mb-3">
                                    Profile Picture
                                </h4>

                                <p>
                                    Add a profile picture to help guests know
                                    you better
                                </p>

                                <Link href="/">
                                    <div className="flex justify-center">
                                        <button className="bg-blue-900 rounded-xl px-6 py-2 w-full text-white text-sm mt-6 hover:bg-blue-800 transition">
                                            Add Picture
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Property Preference */}
                        {profilePercent !== 100 && (
                            <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
                                <h4 className="text-blue-950 font-bold mb-3">
                                    Property Preference
                                </h4>

                                <p>
                                    These preferences will help us match you
                                    better with homes
                                </p>

                                <Link href="/">
                                    <div className="flex justify-center">
                                        <button className="bg-blue-900 rounded-xl px-6 py-2 w-full text-white text-sm mt-6 hover:bg-blue-800 transition">
                                            Update Preferences
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Account Details */}
                        {profilePercent !== 100 && (
                            <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
                                <h4 className="text-blue-950 font-bold mb-3">
                                    Account Details
                                </h4>

                                <p>
                                    Add your account details so we can forward
                                    tenant payments after finalizing a home
                                </p>

                                <Link href="/">
                                    <div className="flex justify-center">
                                        <button className="bg-blue-900 rounded-xl px-6 py-2 w-full text-white text-sm mt-6 hover:bg-blue-800 transition">
                                            Add Account
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default index;
