"use client";
import React, { useState, useEffect} from 'react'
import Link from 'next/link'
import { Menu, X } from "lucide-react";


const index = () => {
    const [isOpen, setIsOpen] = useState(false);


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        }, [isOpen]);
        return (
            <>
                {/*Overlay (shows only when sidebar is open)*/}
                {isOpen && (
                    <div
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black/40 z-40 md:hidden"></div>
                )}

                {/* Sidebar */}
                <aside
                    className={
                        `landlordDashboardSidebar text-white px-2 bg-blue-950 h-[1630px] w-[272px] transform transition-transform duration-300 ${isOpen ? "translate-x-0" :"-translate-x-full"}`
                    }>
                    <Link href="/">
                        <img
                            className="w-45 px-4 h-auto"
                            src="/Okuper_White.png"
                            alt="Okuper Logo"
                        />
                    </Link>
                    <ul className="m-8 -mt-2 justify-between w-30 flex flex-col space-y-6 cursor-pointer">
                        <Link href="/landlordDashboard">
                            <li>Dashboard</li>
                        </Link>

                        <Link href="/helpCenter">
                            <li> Help Center </li>
                        </Link>

                        <Link href="/savedHomes">
                            <li> Saved Homes </li>
                        </Link>

                        <Link href="/messages">
                            <li> Messages </li>
                        </Link>

                        <Link href="/propertyLanding">
                            <li> Listings </li>
                        </Link>

                        <Link href="/verification">
                            <li> Verification </li>
                        </Link>

                        <Link href="/homeInterest">
                            <li> Home Interests </li>
                        </Link>
                    </ul>
                </aside>
                {/* Always show hamburger */}
                <button
                    className="hamburger-wrapper w-10 h-10 fixed top-4 left-20 z-50 bg-white/70 rounded-md flex items-center justify-center shadow-md"
                    onClick={toggleSidebar}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </>
        );
    };

    export default index;
