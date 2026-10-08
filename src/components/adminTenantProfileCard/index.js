"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const TenantProfileCard = ({tenant,property,open,setOpen}) => {

    const router = useRouter();

    const [selecting, setSelecting] = useState(false);
    const [rejecting, setRejecting] = useState(false);


    const [selected, setSelected] = useState(
        property?.selectedTenant?.toString() ===
            tenant?._id?.toString()
    );
    const tenantProfile = tenant?.tenantProfile;

    const handleSelectTenant = async () => {
        if (!tenant?._id || !property?._id) {
            return;
        }

        try {
            setSelecting(true);

            const response = await fetch("/api/homeInterest", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    propertyId: property._id,
                    tenantId: tenant._id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to select tenant");
            }

            setSelected(true);

            toast.success("Tenant selected successfully!");
            
            setTimeout(() => {
            router.push("/message")
            }, 2000)

            setOpen(false);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setSelecting(false);
        }
    };

    const [rejected, setRejected] = useState(
        property?.rejectedTenant?.toString() ===
        tenant?._id?.toString()
    );

    const handleRejectedTenant = async () => {
        if (!tenant?._id || !property?._id) {
            return;
        }

        try {
            setRejecting(true);

            const response = await fetch("/api/homeInterest", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    propertyId: property._id,
                    tenantId: tenant._id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to reject tenant"
                );
            }

            setRejected(true);

            toast.error("Tenant rejected successfully!");
            setTimeout(() => {
                router.push("/landlordHomeInterest")
            }, 2000)
            setOpen(false);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setRejecting(false);
        }
    };

    if (!open) {
        return null;
    }
    
    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
        >
            <div
                className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* CLOSE */}
                <div className="flex  justify-end mb-4">
                    <button
                        onClick={() => setOpen(false)}
                        className="bg-gray-500 cursor-pointer hover:bg-black text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </div>

                {/* TENANT PROFILE */}
                <div className="flex items-center mb-6">
                    <img
                        src={
                            tenantProfile?.previewPic ||
                            tenant?.previewPic ||
                            "/default-profile.png"
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                    />

                    <div>
                        <p className="text-sm text-gray-600">
                            {tenant?.isVerified
                                ? "Verified"
                                : "Not Verified"}
                        </p>

                        <h2 className="text-lg font-semibold">
                            {tenant?.firstName}{" "}
                            {tenant?.lastName}
                        </h2>

                        <p className="text-sm text-gray-600">
                            {tenant?.email}
                        </p>
                    </div>
                </div>

                {/* PROPERTY */}
                <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">
                        Property
                    </h3>

                    {property?.previewPic && (
                        <img
                            src={property.previewPic}
                            alt={
                                property.title ||
                                "Property"
                            }
                            className="w-full h-48 object-cover rounded"
                        />
                    )}

                    <p className="font-semibold mt-3">
                        {property?.title}
                    </p>

                    <p className="text-gray-600">
                        {property?.address}
                    </p>
                </div>

                <hr className="my-6" />

                {/* IDENTIFICATION */}
                <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-4">
                        Identification
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Document Type
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.documentType ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                ID Number
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.idNumber ||
                                    "Not provided"}
                            </p>
                        </div>
                    </div>

                    {tenantProfile?.documentImage && (
                        <div className="mt-5">
                            <p className="text-sm text-gray-500 mb-2">
                                Identification Document
                            </p>

                            <img
                                src={
                                    tenantProfile.documentImage
                                }
                                alt={
                                    tenantProfile.documentType ||
                                    "Document Image"
                                }
                                className="w-full max-h-80 object-contain rounded-lg border"
                            />
                        </div>
                    )}
                </div>

                <hr className="my-6" />

                {/* PERSONAL INFORMATION */}
                <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-4">
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Gender
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.gender ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Age
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.age ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Occupation
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.occupation ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Specify Occupation
                            </p>
                            <p className="font-medium">
                                {Array.isArray(
                                    tenantProfile?.specifyOccupation
                                )
                                    ? tenantProfile.specifyOccupation.join(
                                          ", "
                                      )
                                    : tenantProfile?.specifyOccupation ||
                                      "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Marital Status
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.maritalStatus ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Spouse Name
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.spouseName ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Number of Children
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.noOfChildren ??
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Religion
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.religion ||
                                    "Not provided"}
                            </p>
                        </div>
                    </div>
                </div>

                <hr className="my-6" />

                {/* COMPANY INFORMATION */}
                <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-4">
                        Company Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Company Name
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.companyName ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Company Phone
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.companyPhone ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Company Email
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.companyEmail ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Company Address
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.companyAddress ||
                                    "Not provided"}
                            </p>
                        </div>
                    </div>
                </div>

                <hr className="my-6" />

                {/* ADDRESS INFORMATION */}
                <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-4">
                        Address Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Current Address
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.currentAddress ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                City
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.city ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                State
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.state ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Country
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.country ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                ZIP Code
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.zipCode ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                State of Origin
                            </p>
                            <p className="font-medium">
                                {tenantProfile?.stateOfOrigin ||
                                    "Not provided"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* SELECT */}
                <div className="flex gap-87 justify-end pt-4">
                    <button
                        onClick={handleRejectedTenant}
                        disabled={selecting || rejecting || rejected}
                        className={`px-4 py-2 rounded cursor-pointer text-white ${
                            selected
                                ? "bg-amber-600"
                                :rejected
                                ? "bg-red-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {rejecting
                            ? "Rejecting..."
                            : rejected
                            ? "Reject"
                            : "Reject Tenant"}
                    </button>

                    <button
                        onClick={handleSelectTenant}
                        disabled={selecting || selected}
                        className={`px-4 py-2 rounded cursor-pointer text-white ${
                            selected
                                ? "bg-green-600"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {selecting
                            ? "Selecting..."
                            : selected
                            ? "Tenant Selected"
                            : "Select Tenant"}
                    </button>
                </div>
            </div>
        
        <ToastContainer />

        </div>
    );
};

export default TenantProfileCard;