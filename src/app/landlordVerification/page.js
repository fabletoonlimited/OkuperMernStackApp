"use client"

import React, { useState, useEffect } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter";
import LandlordProfilePage from "@/app/landlordProfileForm/page";

const landlordVerification = ({params}) => {
  
    // landlord state
    const [landlord, setLandlord] = useState(null);
    const [landlordProfile, setLandlordProfile] = useState(null)
    const [landlordEmail, setLandlordEmail] = useState(null);
    const {propertyId} = params;

    // ✅ get logged in landlord
    useEffect(() => {
        const getMe = async () => {
            try {
                const res = await fetch("/api/user/me", {
                    method: "GET",
                    cache: "no-store",
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
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/landlordProfile/upload", {
                    method: "GET",
                    credentials: "include",
                });
    
                if (!res.ok) {
                    toast.error("Failed to load landlord profile");
                    return;
                }
    
                const data = await res.json();        
                console.log(data); 
                setLandlordProfile(data);

            } catch (err) {
                console.error("Profile fetch error:", err);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
    
            fetchProfile();
    }, []);

  return (
    <div>
      <LandlordDashboardSidebar />
        <div className="bg-white shadow-md p-10 rounded-md  ">
            <h1 className="font-bold md:text-5xl text-2xl pl-7">
                Dear, {" "}
                {
                    landlord
                    ? `${landlord.firstName} ${landlord?.lastName}`
                    : "Landlord"
                }
                !
            </h1>
            <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
                We are thrilled that you have chosen to list your property with Okuper.
            </p>
        </div>

      <LandlordProfilePage landlordProfile={landlordProfile} />
      <LandlordDashboardFooter />
    </div>
  );
};

export default landlordVerification;
