"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";
import Link from "next/link";

const index = () => {
    const router = useRouter();

    return (
        <div>
            <div className="exp-prop-nav bg-white flex items-center justify-between px-4 py-3">
                <div className="flex items-center back-to-listing gap-3 cursor-pointer">
                    <FaAngleLeft className="text-blue-800" />
                    <Link href="/rent">
                        <h3 className="font-regular text-blue-800">
                            Back to Listing
                        </h3>
                    </Link>
                </div>
                <Link href="/">
                    <div className="flex items-center ml-26">
                        <img
                            src="/logo.png"
                            alt="Okuper Logo"
                            className="flex items-center w-auto h-24"
                        />
                    </div>
                </Link>

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

                    <Link href="/Contact">
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
        </div>
    );
};

export default index;
