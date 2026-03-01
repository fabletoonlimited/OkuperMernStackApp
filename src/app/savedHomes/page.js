"use client";
import { ChevronDown, Trash2, Menu } from "lucide-react";
import PropertyCard from "@/components/propertyCard";
import { useState } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar";

export default function SavedHomes() {
    return (
        <>
            <div >
                <LandlordDashboardSidebar />
                <div className="bg-[#123d8d] text-white flex items-center justify-around px-10 py-6">
                    {/* Left Section */}
                    <div className="flex items-center gap-8">
                        {/* Saved Count */}
                        <div className="flex items-center gap-4 text-2xl font-semibold">
                            <div className="w-8 h-8 border-2 border-white rounded-md flex items-center justify-center text-base">
                                ✓
                            </div>
                            <span>5 Saved Homes</span>
                        </div>
                    </div>

                    <div className="flex justify-around">
                        <div className="gap-5">
                            <button className="bg-white text-blue-900 px-7 py-3 rounded-xl flex items-center gap-3 text-base font-medium hover:bg-gray-300 transition cursor-pointer">
                                Show All <ChevronDown size={20} />
                            </button>
                        </div>

                        <div className="gap-5 ml-10">
                            <button className="bg-white text-blue-900 px-7 py-3 rounded-xl flex items-center gap-3 text-base font-medium hover:bg-gray-300 transition cursor-pointer">
                                By Date <ChevronDown size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-8">
                        <button className="flex items-center gap-3 text-lg cursor-pointer font-medium hover:opacity-80 transition">
                            Remove <Trash2 size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-8">
                        <Menu size={28} className="cursor-pointer" />
                    </div>
                </div>
            </div>
            <div className="flex justify-center ">
                <div className="grid grid-cols-3 gap-24">
                    <PropertyCard />
                    <PropertyCard />
                    <PropertyCard />
                    <PropertyCard />
                    <PropertyCard />
                    <PropertyCard />
                </div>
            </div>
        </>
    );
}
