"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";


const index = () => {
  const router = useRouter();
  const [profilePercent, setProfilePercent] = useState(null);
  const [loadingUtility, setLoadingUtility] = useState(true);
  const [uploadedUtility, setUploadedUtility] = useState(false);
  const [checking, setChecking] = useState(false);

  
  //Add Utility
  useEffect(() => {
    const fetchUtilityUpload = async () => {
      try {
        setLoadingUtility(true);

        const res = await fetch("/api/uploads/utilityBill", {
          credentials: "include",
        });

        if (!res.ok) {
          setUploadedUtility(false);
          return;
        }

        const data = await res.json();

        setUploadedUtility(Boolean(data.uploaded));
      } catch (err) {
        setUploadedUtility(false);
      } finally {
        setLoadingUtility(false);
      }
    };

    fetchUtilityUpload();
  }, []);

  // Profile completion
  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const res = await fetch("/api/tenantProfile/completion", {
          credentials: "include",
        });

        if (!res.ok) {
          setProfilePercent(null);
          return;
        }

        const data = await res.json();
        setProfilePercent(data.percent || 0);
      } catch (err) {
        console.error("Profile completion error:", err);        
        setProfilePercent(null);
      }
    };

    fetchCompletion();
  }, []);

  const handleUploadClick = async (e) => {
      e.preventDefault();
  
      if (checking) return;
  
      setChecking(true);
  
      try {
          if (profilePercent !== 100) {
              toast.error("Please complete KYC first");
              return;
          }

          router.push("/utilityBillUploadPage")
        } finally {
          setChecking(false);
      }
  }

  return (
    // Profile Completionn
     <div className="row">
      <ToastContainer />
      
      {/* Card 1*/}
      <div className="tenantDashboardCard grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 space-y-10">
        
        {profilePercent !== null && profilePercent < 100 && (
          <div className="rounded-lg h-57 w-80 bg-blue-600 p-5 shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">

            <h4 className="font-black md:text-2xl p-2 text-white text-xl text-left">
              Your Profile
            </h4>

            <p className="text-left text-md text-white p-2 mb-2">
              {`Your information is ${profilePercent}% complete. Please complete your profile to enjoy full benefits.`}
            </p>

            <Link href="/tenantVerification">
              <button
                className="bg-amber-500 hover:bg-blue-900 rounded-full py-3 w-65 text-white -mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={profilePercent === 100}
              >
                {profilePercent === 100
                  ? "Completed"
                  : profilePercent === 64
                  ? "Uploaded"
                  : "Update Your profile"}
              </button>
            </Link>
          </div>
        )}

        {/* Card 2*/}
         <div className="rounded-lg h-57 w-80 bg-amber-400 p-8 shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
          <h4 className="font-black text-white md:text-2xl text-xl text-left leading-7 mb-3">
            Utility Bill
          </h4>
          <p className="text-left mb-6 text-white">
            {uploadedUtility
              ? "Utility bill uploaded"
              : "Upload your 3 months LAWMA, Water or Electricity utility bill"
            }
          </p>
          {uploadedUtility ? (
            <button
              onClick={handleUploadClick}
              type="button"
              disabled
              className="mt-10 w-65 py-3 rounded-full bg-gray-500 text-white"
            >
              Uploaded
            </button>
          ) : (
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={loadingUtility}
              className="mt-4 py-3 w-65 cursor-pointer rounded-full bg-blue-900 text-white hover:bg-blue-600"
            >
              {loadingUtility ? "Checking..." : "Upload"}
            </button>
          )}
        </div>

        {/* Card 3*/}
          <div className="rounded-lg h-57 w-80 bg-linear-to-r from-blue-900 to-blue-700 p-7 shadow-lg hover:shadow-xl hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <h4 className="font-black text-white md:text-2xl text-xl text-left leading-7 mb-3">
            Card Details
          </h4>
          <p className="text-white text-left">
            Add your card details to enable quick payments. <i>(coming soon)</i>
          </p>
          <Link
            href="#"
          >
            <button className="disabled:opacity-50 disabled:cursor-not-allowed rounded-full border-2 border-gray-300 w-65 text-white mt-10 py-2">
              Add card
            </button>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center justify-center">
          {/*Advert */}
          <Link href={""}>
            <div className="h-30 bg-gray-700 md:w-295 w-80 mt-20 md:justify-center justify-left md:items-center items-left px-6">
              <p className="justify-center items-center pt-12 pl-10 text-white">Video Advert goes here...</p>
            </div>
          </Link>
      </div>
    </div>
  );
};

export default index;
