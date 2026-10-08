"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import Link from "next/link";

const Index = ({ propertyId }) => {
    const router = useRouter();

    const [rating, setRating] = useState(0);
    

    const handleReport = () => {
        console.log("PROPERTY ID RECEIVED:", propertyId);

        if (!propertyId) {
            console.error("No property ID received");
            return;
        }

        router.push(`/report?propertyId=${propertyId}`);
    };

    return (
        <div>
            <div className="exp-prop-nav bg-white flex items-center justify-between px-4 py-3">

                {/* Back */}
                <div className="flex items-center gap-3 cursor-pointer">
                    <Link href="/rent">
                        <FaAngleLeft className="text-blue-800" />
                    </Link>

                    <Link href="/rent">
                        <h3 className="font-regular text-blue-800">
                            Back to Listing
                        </h3>
                    </Link>
                </div>

                {/* Logo */}
                <Link href="/">
                    <div className="flex items-center ml-26">
                        <img
                            src="/logo.png"
                            alt="Okuper Logo"
                            className="w-auto h-24"
                        />
                    </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center justify-around gap-10 mr-18">

                    {/* Save */}
                    <Link href="/savedHomes">
                        <button
                            type="button"
                            className="w-14 h-14"
                        >
                            <img
                                src="/Save_House_Icon.png"
                                alt="Save Icon"
                                className="w-full h-full object-contain"
                            />
                        </button>
                    </Link>

                    {/* Share */}
                    <Link href="/share">
                        <button
                            type="button"
                            className="w-14 h-14"
                        >
                            <img
                                src="/Share_Icon.png"
                                alt="Share Icon"
                                className="w-full h-full object-contain"
                            />
                        </button>
                    </Link>

                    {/* Report */}
                    <button
                        type="button"
                        className="w-14 h-14 cursor-pointer"
                        onClick={() => {
                            if (!propertyId) {
                                console.error("No property ID available");
                                return;
                            }

                            console.log("REPORT PROPERTY ID:", propertyId);

                            router.push(`/report?propertyId=${propertyId}`);
                        }}
                    >
                        <img
                            src="/Report_Icon.png"
                            alt="Report Icon"
                            className="w-full h-full object-contain"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Index;