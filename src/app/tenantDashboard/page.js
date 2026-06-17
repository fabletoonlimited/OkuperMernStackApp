"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TenantDashboardSidebar from "../../components/tenantDashboardSidebar";
import TenantDashboardCard from "../../components/tenantDashboardCard";
import TenantDashboardFooter from "../../components/tenantDashboardFooter";
import TenantDashboardCompleted from "../tenantDashboardCompleted/page.js";

function TenantDashboard() {
  const [profilePercent, setProfilePercent] = useState(null);
  const [utilityCompletion, setUtilityCompletion] = useState(false);
  const [utilityLoading, setUtilityLoading] = useState(true);
  const [tenant, setTenant] = useState(null);

  // Utility
  useEffect(() => {
    const fetchCompleteUtility = async () => {
      try {
        const res = await fetch("/api/uploads/utilityBill", {
          credentials: "include",
        });

        if (!res.ok) {
          setUtilityCompletion(false);
          return;
        }

        const data = await res.json();
        setUtilityCompletion(Boolean(data.uploaded));
      } catch (err) {
        console.error(err);
        setUtilityCompletion(false);
      } finally {
        setUtilityLoading(false);
      }
    };

    fetchCompleteUtility();
  }, []);

  // Profile
  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const res = await fetch("/api/profile/completion", {
          credentials: "include",
        });

        if (!res.ok) {
          setProfilePercent(null);
          return;
        }

        const data = await res.json();
        setProfilePercent(Number.isFinite(data.percent) ? data.percent : 0);
      } catch (err) {
        console.error("Profile completion error:", err);
        setProfilePercent(null);
      }
    };

    fetchCompletion();
  }, []);

  // Tenant
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await fetch("/api/tenant", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          toast.error("Failed to fetch tenant");
          return;
        }

        const data = await res.json();
        setTenant(data);
      } catch (err) {
        console.error(err);
        toast.error("Tenant fetch error");
      }
    };
  fetchTenant();
}, []);

  if (profilePercent === 100 && utilityCompletion) {
    return (
      <>
        <TenantDashboardCompleted />
        <TenantDashboardFooter />
      </>
    );
  }

  if (profilePercent === null || utilityLoading) {
    return <TenantDashboardFooter />;
  }

  return (
    <>
      {profilePercent && utilityCompletion === 100 && (<TenantDashboardCompleted />) }
      {profilePercent && utilityCompletion !== null && (
      <div className="tenantDashboardContainer flex">
        {/* Sidebar */}
        <TenantDashboardSidebar />

        {/* Main content */}
        <div className="flex-1">
          <div
            className="tenantDashboardWelcomeMessage mt-8 p-6 bg-white"
            style={{
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h1 className="font-bold md:text-5xl text-2xl pl-7 mb-2">
              Welcome, {tenant?.firstName + " " + tenant?.lastName || "Tenant"}!
            </h1>
            <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
              We are thrilled that you have chosen Okuper to rent your next
              property.
            </p>
          </div>

          <div className="tenantDashboardNextSteps md:mt-8 p-7">
            <h3 className="font-medium md:text-4xl text-2xl pl-7">
              Your next steps
            </h3>
            <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
              There are a few things left to do. In order to begin your rental journey, please complete your profile.
            </p>
          </div>
          <div className="md:px-16 px-0">
            <TenantDashboardCard />
          </div>
        </div>
      </div>
) }
  <TenantDashboardFooter />
  </>
  );
}
export default TenantDashboard;
