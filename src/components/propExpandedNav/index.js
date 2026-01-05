"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";
import Link from "next/link";

const index = () => {
    const router = useRouter();

    return (
        <div className="exp-prop-nav bg-white flex items-center justify-between px-4 py-3">
            <div className="flex items-center back-to-listing gap-3 cursor-pointer">
                <FaAngleLeft />
                <Link href="/propertyListing">
                    <h3 className="font-bold">Back to Listing</h3>
                </Link>
            </div>

            <div className="flex items-center ml-26">
                <img
                    src="/logo.png"
                    alt="Okuper Logo"
                    className="flex items-center w-40 h-24"
                />
            </div>

            <div className="flex items-center justify-around gap-10 mr-18">
                <Link href="/savedHomes">
                    <button className="w-14 h-14">
                        <img
                            src="/Save_House_Icon.png"
                            alt="Save Icon"
                            className="w-full h-full object-contain"
                        />
                    </button>
                </Link>

                <Link href="/share">
                    <button className="w-14 h-14">
                        <img
                            src="/Share_Icon.png"
                            alt="Share Icon"
                            className="w-full h-full object-contain"
                        />
                    </button>
                </Link>

                <Link href="/report">
                    <button className="w-14 h-14">
                        <img
                            src="/Report_Icon.png"
                            alt="Report Icon"
                            className="w-full h-full object-contain"
                        />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default index;
