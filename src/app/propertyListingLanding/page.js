"use client";

import React, { useState } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter";
import PropertyUploadLanding from "../../components/PropertyUploadLanding";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        cardNo: "",
        cvv2: "",
        expDate: "",
    });

    const handleInputChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <LandlordDashboardSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Welcome Section */}
                <div className="mt-8 mx-6 p-6 bg-white shadow">
                    <h1 className="font-bold md:text-5xl text-2xl">
                        Dear, Landlord!
                    </h1>

                    <p className="mt-2 md:text-xl font-medium">
                        We are thrilled that you have chosen to list your
                        property with Okuper.
                    </p>
                </div>

                {/* Property Section */}
                <div className="mt-8 mx-6">
                    <h3 className="font-semibold md:text-4xl text-2xl">
                        Property Listing
                    </h3>

                    <p className="mt-2 md:text-xl font-medium">
                        Please use the form below to upload two FREE your
                        property.
                    </p>
                </div>

                {/* Body */}
                <div className="flex-1">
                    <PropertyUploadLanding />
                </div>

                {/* Footer */}
                <LandlordDashboardFooter />
            </div>
        </div>
    );
};

export default Page;
