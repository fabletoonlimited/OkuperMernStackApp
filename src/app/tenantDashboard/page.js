"use client"
import TenantDashboardSidebar from "../../components/tenantDashboardSidebar";
import TenantDashboardCard from "../../components/tenantDashboardCard";
import TenantDashboardFooter from "../../components/tenantDashboardFooter";
import React, { useState, useEffect } from "react";
import TenantDashboardCompleted from "../tenantDashboardCompleted/page.js";
import { toast } from "react-toastify";

function tenantDashboard() {
   const [profilePercent, setProfilePercent] = useState(null);
   const [tenant, setTenant] = useState(null);
  
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

          const tenant = await res.json();
          setTenant(tenant);
        } catch (err) {
          toast.error("Tenant fetch error:", err);
        }
      };

      fetchTenant();
    }, []);

  return (
    <>
      {profilePercent === 100 && (<TenantDashboardCompleted /> ===100) }
      {profilePercent !== null && (
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

export default tenantDashboard;
