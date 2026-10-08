"use client";

import React, { useEffect, useState } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter";
import LandlordProfilePage from "@/app/landlordProfileForm/page";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LandlordVerification = ({ params }) => {
    const [landlord, setLandlord] = useState(null);
    const [landlordProfile, setLandlordProfile] = useState(null);

    const { propertyId } = params;

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch("/api/landlord", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data?.message || "Failed to fetch landlord");
                    return;
                }

                setLandlord(data);
            } catch (error) {
                toast.error("Landlord fetch error");
            }
        };

        fetchLandlord();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    "/api/landlordProfile/completion",
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    if (res.status === 404) {
                        setLandlordProfile(null);
                        return;
                    }

                    toast.error(
                        data?.message || "Failed to load landlord profile"
                    );
                    return;
                }

                setLandlordProfile(data?.profile || null);
            } catch (error) {
                toast.error("Failed to load profile");
            }
        };

        fetchProfile();
    }, []);

    return (
        <div>
            <LandlordDashboardSidebar />

            <ToastContainer />

            <div className="bg-white shadow-md p-10 rounded-md">
                <h1 className="font-bold md:text-5xl text-2xl pl-7">
                    Dear{" "}
                    {landlord
                        ? `${landlord.firstName} ${landlord.lastName}`
                        : "Landlord"}
                    !
                </h1>

                <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
                    We are thrilled that you have chosen to list your property
                    with Okuper.
                </p>
            </div>

            <LandlordProfilePage
                landlordProfile={landlordProfile}
                propertyId={propertyId}
            />

            <LandlordDashboardFooter />
        </div>
    );
};

export default LandlordVerification;