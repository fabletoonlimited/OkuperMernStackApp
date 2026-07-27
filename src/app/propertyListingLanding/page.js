"use client";

import React, { useState, useEffect } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter";
import PropertyUploadLanding from "../../components/PropertyUploadLanding";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  // landlord state
  const [landlord, setLandlord] = useState(null);
  const [landlordEmail, setLandlordEmail] = useState(null);

  // ✅ get logged in landlord
  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await fetch("/api/user/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) return;

        // adjust depending on your response shape
        const email = data?.user?.email || data?.email;
        setLandlordEmail(email || null);
      } catch (err) {
        console.error("Auth me error:", err);
      }
    };
    getMe();
  }, []);

  // Landlord
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch("/api/landlord", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          toast.error("Failed to fetch landlord");
          return;
        }

        const data = await res.json();
        setLandlord(data);
      } catch (err) {
        console.error(err);
        toast.error("Landlord fetch error");
      }
    };
    fetchLandlord();
  }, []);

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
          <h1 className="font-bold md:text-5xl text-2xl pl-7">
            Dear, {}
            {landlord
              ? `${landlord.firstName} ${landlord?.lastName}`
              : "Landlord"}
            !
          </h1>
          <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
            We are thrilled that you have chosen to list your property with
            Okuper.
          </p>
        </div>

        {/* Property Section */}
        <div className="mt-8 mx-6">
          <h3 className="font-semibold md:text-4xl text-2xl">
            Property Listing
          </h3>

          <p className="mt-2 md:text-xl font-medium">
            Please use the form below to upload two FREE your property.
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
