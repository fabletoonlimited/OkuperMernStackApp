"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ReportPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Property ID passed from property page
    const propertyId = searchParams.get("propertyId");

    const [tenant, setTenant] = useState(null);
    const [complaint, setComplaint] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingTenant, setLoadingTenant] = useState(true);

    // ==========================================
    // GET LOGGED-IN TENANT
    // ==========================================
    useEffect(() => {
        const fetchLoggedInTenant = async () => {
            try {
                setLoadingTenant(true);

                const response = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                const data = await response.json();

                console.log("AUTH ME RESPONSE:", data);

                if (!response.ok) {
                    toast.error(
                        data?.message ||
                        data?.error ||
                        "Failed to fetch logged-in user."
                    );
                    return;
                }

const user = data?.user || data;

console.log("AUTH ME RESPONSE:", data);
console.log("AUTHENTICATED USER:", user);

// /api/auth/me gives us the Tenant document ID as actorId
const tenantId = user?.actorId;

console.log("TENANT ID:", tenantId);

if (!tenantId) {
    console.error(
        "No tenant actorId returned from /api/auth/me:",
        user
    );

    toast.error(
        "Tenant information could not be found."
    );

    return;
}

if (user?.role?.toLowerCase() !== "tenant") {
    toast.error("Only tenants can submit a property report.");
    return;
}

// Fetch the actual Tenant document
const tenantResponse = await fetch(
    `/api/tenant?id=${tenantId}`,
    {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    }
);

const tenantData = await tenantResponse.json();

console.log("TENANT API RESPONSE:", tenantData);

if (!tenantResponse.ok) {
    toast.error(
        tenantData?.message ||
        tenantData?.error ||
        "Failed to fetch tenant."
    );

    return;
}

const tenantRecord =
    tenantData?.tenant ||
    tenantData;

console.log("FINAL TENANT:", tenantRecord);

setTenant(tenantRecord);

            } catch (error) {
                console.error(
                    "FETCH LOGGED-IN TENANT ERROR:",
                    error
                );

                toast.error(
                    "Failed to load tenant information."
                );
            } finally {
                setLoadingTenant(false);
            }
        };

        fetchLoggedInTenant();
    }, []);

    // ==========================================
    // SUBMIT DISPUTE
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!propertyId) {
            toast.error("No property was selected.");
            return;
        }

        if (!tenant?._id) {
            toast.error(
                "Tenant information is not available."
            );
            return;
        }

        if (!complaint.trim()) {
            toast.error("Please enter your complaint.");
            return;
        }

        if (!rating) {
            toast.error("Please select a rating.");
            return;
        }

        try {
            setLoading(true);

            console.log("SUBMITTING DISPUTE:", {
                tenant: tenant._id,
                property: propertyId,
                complaint: complaint.trim(),
                rating,
            });

            const response = await fetch("/api/disputes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    tenant: tenant._id,
                    complaint: complaint.trim(),
                    rating,
                    property: propertyId,
                }),
            });

            const data = await response.json();

            console.log(
                "DISPUTE RESPONSE:",
                data
            );

            if (!response.ok) {
                toast.error(
                    data?.message ||
                    data?.error ||
                    "Failed to submit complaint."
                );
                return;
            }

            toast.success("Complaint submitted successfully.");

            setComplaint("");
            setRating(0);

            // Go back to the exact property that was reported
            router.push(
                `/propertyCardExpanded?propertyId=${encodeURIComponent(propertyId)}`
            );
        } catch (error) {
            console.error(
                "SUBMIT DISPUTE ERROR:",
                error
            );

            toast.error(
                "Something went wrong while submitting your complaint."
            );
        } finally {
            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow p-6">

                <h1 className="text-2xl font-semibold mb-2">
                    Property Dispute / Report Property
                </h1>

                <p className="text-gray-500 mb-6">
                    Please tell us about the issue you experienced
                    with this property.
                </p>

                {!propertyId ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded">
                        No property was selected for this report.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>

                        {/* PROPERTY */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2">
                                Property
                            </label>

                            <input
                                type="text"
                                value={propertyId}
                                readOnly
                                className="w-full border rounded-lg px-4 py-3 bg-gray-100 text-gray-600"
                            />
                        </div>

                        {/* TENANT */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2">
                                Tenant Name
                            </label>

                            <input
                                type="text"
                                value={
                                    loadingTenant
                                        ? "Loading..."
                                        : tenant
                                        ? `${tenant.firstName || ""} ${tenant.lastName || ""}`.trim()
                                        : "Tenant not found"
                                }
                                readOnly
                                className="w-full border rounded-lg px-4 py-3 bg-gray-100 text-gray-600"
                            />
                        </div>

                        {/* COMPLAINT */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2">
                                Complaint
                            </label>

                            <textarea
                                value={complaint}
                                onChange={(e) =>
                                    setComplaint(e.target.value)
                                }
                                placeholder="Describe the problem with this property..."
                                rows={6}
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
                            />
                        </div>

                        {/* RATING */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Rating
                            </label>

                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(
                                    (number) => (
                                        <button
                                            key={number}
                                            type="button"
                                            onClick={() =>
                                                setRating(number)
                                            }
                                            className={`text-2xl ${
                                                number <= rating
                                                    ? "text-yellow-500"
                                                    : "text-gray-300"
                                            }`}
                                        >
                                            ★
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    router.back()
                                }
                                className="px-5 py-3 border cursor-pointer rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    loadingTenant ||
                                    !tenant?._id
                                }
                                className="px-5 py-3 bg-black hover:bg-gray-800 cursor-pointer text-white rounded-lg disabled:opacity-50"
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Complaint"}
                            </button>

                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}