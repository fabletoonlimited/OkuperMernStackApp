"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar/index.js";
import AdminTenantProfileCard from "../../components/adminTenantProfileCard/index.js";
import SubscriptModal from "../../components/subscriptionModalHomeInterest";

const Page = () => {
    const [interest, setInterest] = useState([]);
    const [selectedInterest, setSelectedInterest] = useState(null);
    const [interestCount, setInterestCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [subscribed, setIsSubscribed] = useState(false);
    const [landlordEmail, setLandlordEmail] = useState("");

    useEffect(() => {
        const fetchPropertyInterests = async () => {
            try {
                const response = await fetch("/api/homeInterest", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                const data = await response.json();

                if (!response.ok) {
                    setInterest([]);
                    setInterestCount(0);
                    return;
                }

                const interests = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.interests)
                    ? data.interests
                    : Array.isArray(data?.homeInterests)
                    ? data.homeInterests
                    : data?.interest
                    ? [data.interest]
                    : [];

                setInterest(interests);
                setInterestCount(interests.length);
            } catch (error) {
                setInterest([]);
                setInterestCount(0);
            }
        };

        fetchPropertyInterests();
    }, []);

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const response = await fetch("/api/landlord", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                if (!response.ok) return;

                const data = await response.json();

                if (data?.email) {
                    setLandlordEmail(data.email);
                }
            } catch (error) {
                // Do nothing
            }
        };

        fetchLandlord();
    }, []);

    const handleSubscribe = async () => {
        if (!landlordEmail) {
            toast.error("Landlord email not found.");
            return;
        }

        if (subscribed || interest.length <= 3) {
            return;
        }

        try {
            const res = await fetch("/api/landlordSubscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: landlordEmail,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to initialize payment.");
                return;
            }

            if (!data.paymentUrl) {
                toast.error("Payment URL was not provided.");
                return;
            }

            const width = 500;
            const height = 750;
            const left = 300;
            const top = 100;

            const popup = window.open(
                data.paymentUrl,
                "XpressPayment",
                `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
            );

            if (!popup) {
                toast.error(
                    "Popup blocked. Please allow pop-ups and try again."
                );
            }
        } catch (err) {
            toast.error("Failed to initialize payment.");
        }
    };

    const handleInterestClick = (item) => {
        setSelectedInterest(item);
        setOpen(true);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 h-screen overflow-y-auto">
            <LandlordDashboardSidebar />

            {interest.length > 0 ? (
                interest.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white p-4 h-100 hover:bg-blue-100 rounded hover:shadow-2xl shadow cursor-pointer"
                        onClick={() => handleInterestClick(item)}
                    >
                        {item.property?.previewPic && (
                            <img
                                src={item.property.previewPic}
                                alt={
                                    item.property?.title ||
                                    "Property"
                                }
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                        )}

                        <h3>
                            {item.tenant?.firstName || item.firstName}{" "}
                            {item.tenant?.lastName || item.lastName}
                        </h3>

                        <p className="font-bold">
                            {item.tenant?.email || item.email}
                        </p>

                        <p className="font-bold">
                            Property:{" "}
                            {item.property?.title || "Property"}
                        </p>

                        <p className="font-bold">
                            Address: {item.property?.address || "N/A"}
                        </p>

                        <p className="font-bold">
                            Status: {item.status}
                        </p>
                    </div>
                ))
            ) : (
                <div>
                    No tenants have expressed interest...
                </div>
            )}

            {selectedInterest ? (
                <AdminTenantProfileCard
                    tenant={selectedInterest.tenant}
                    property={selectedInterest.property}
                    open={open}
                    setOpen={setOpen}
                />
            ) : (
                <SubscriptModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onContinue={handleSubscribe}
                />
            )}
        </div>
    );
};

export default Page;