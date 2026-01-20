"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  const router = useRouter();

  /* =======================
     STATE
  ======================= */
  const [selectResidencyStatus, setSelectResidencyStatus] = useState(null);
  const [showResidencyStatus, setShowResidencyStatus] = useState(false);
  const [error, setError] = useState(null);

  const [selectWhoIsUsingPlatform, setSelectWhoIsUsingPlatform] =
    useState(null);
  const [showWhoIsUsingPlatform, setShowWhoIsUsingPlatform] = useState(false);
  const [errorWhoIsUsingPlatform, setErrorWhoisUsingPlatform] = useState(null);

  /* =======================
     EFFECTS
  ======================= */

  // Residency dropdown
  useEffect(() => {
    if (!selectResidencyStatus || selectResidencyStatus === "selectOne") {
      setShowResidencyStatus(true);
    } else {
      setShowResidencyStatus(false);
      setError(null);
    }
  }, [selectResidencyStatus]);

  // Who-is-using-platform buttons
  useEffect(() => {
    if (!selectWhoIsUsingPlatform) {
      setShowWhoIsUsingPlatform(true);
    } else {
      setShowWhoIsUsingPlatform(false);
      setErrorWhoisUsingPlatform(null);
    }
  }, [selectWhoIsUsingPlatform]);

  // ✅ Resume signup safely (FIXED)
  useEffect(() => {
    const resumeSignup = async () => {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");

      if (!userId || !role) return;

      try {
        const res = await fetch(`/api/user?id=${userId}`);

        if (!res.ok) {
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          return;
        }

        router.replace(
          role === "tenant"
            ? `/signUpTenant?userId=${userId}`
            : `/signUpLandlord?userId=${userId}`,
        );
      } catch {
        // silent fail
      }
    };

    resumeSignup();
  }, [router]);

  /* =======================
     CONSTANTS
  ======================= */

  const residencyStatus = {
    selectOne: "Select One",
    citizen: "Citizen",
    permanentResident: "Permanent Resident",
    workPermit: "Work Permit",
    studentVisa: "Student Visa",
    visitorVisa: "Visitor Visa",
  };

  const residencyMap = {
    citizen: "Citizen",
    permanentResident: "Permanent Resident",
    workPermit: "Work Permit",
    studentVisa: "Student Visa",
    visitorVisa: "Visitor Visa",
  };

  const enumValues = [
    "selectOne",
    "citizen",
    "permanentResident",
    "workPermit",
    "studentVisa",
    "visitorVisa",
  ];

  const translated = enumValues.map((residency) => ({
    value: residency,
    label: residencyStatus[residency],
  }));

  const whoIsUsingPlatform = {
    myself: "myself",
    someoneElse: "someoneElse",
  };

  const enumWhoIsUsingPlatformValues = ["myself", "someoneElse"];

  const NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "dfdzbuk0c";
  const BASE_URL = `https://res.cloudinary.com/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

  /* =======================
       CREATE USER
    ======================= */

  const createUser = async (role) => {
    try {
      if (!selectResidencyStatus || selectResidencyStatus === "selectOne") {
        toast.error("Please select your residency status");
        return;
      }

      if (!selectWhoIsUsingPlatform) {
        toast.error("Please select who is using the platform");
        return;
      }

      const residencyMap = {
        citizen: "Citizen",
        permanentResident: "Permanent Resident",
        workPermit: "Work Permit",
        studentVisa: "Student Visa",
        visitorVisa: "Visitor Visa",
      };

      // Capitalize role to match schema enum
      // const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residencyStatus: residencyMap[selectResidencyStatus],
          whoIsUsingPlatform: selectWhoIsUsingPlatform,
          role,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      const userId = data._id || data.user?._id;
      const userRole = data.role || data.user?.role;

      localStorage.setItem("userId", userId);
      localStorage.setItem("role", userRole);

      toast.success(
        data.exists
          ? "Welcome back! Resuming signup…"
          : "User created successfully",
      );

      router.replace(
        userRole === "tenant"
          ? `/signUpTenant?userId=${userId}&residencyStatus=${residencyMap[selectResidencyStatus]}&whoIsUsingPlatform=${selectWhoIsUsingPlatform}`
          : `/signUpLandlord?userId=${userId}&residencyStatus=${residencyMap[selectResidencyStatus]}&whoIsUsingPlatform=${selectWhoIsUsingPlatform}`,
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <h1
        className="font-bold text-4xl"
        style={{ paddingLeft: 50, marginTop: 70 }}
      >
        Sign Up
      </h1>

      {/*Residency Status*/}
      <div className="signUpLoandingContainer md:flex-col col mt-10 mb-10">
        <ToastContainer position="top-center" autoClose={3000} />

        <div
          className="residencyStatusSection text-2xl mt-10 mb-20 md:w-100% w-50% md:mr-10 mr-10"
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "556px",
            // width: '100%',
            height: "650px",
            maxHeight: "100%",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "5px",
            paddingLeft: "40px",
            paddingRight: "50px",
            marginTop: "20px",
            marginLeft: "50px",
            marginBottom: "50px",
          }}
        >
          <p style={{ paddingTop: 40, marginBottom: 30 }}>
            What is your residency status?
          </p>

          {selectResidencyStatus && !showResidencyStatus && (
            <p
              className="text-start text-muted text-2xl mb-2 px-1"
              onClick={() => setShowResidencyStatus(true)}
              style={{
                cursor: "pointer",
                borderRadius: "4px",
                border: "1px solid #ccc",
                padding: "2px",
              }}
            >
              <strong>{selectResidencyStatus}</strong> (click to change)
            </p>
          )}
          {showResidencyStatus && (
            <select
              value={selectResidencyStatus || "selectOne"}
              onChange={(e) => setSelectResidencyStatus(e.target.value)}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              {translated.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
        {/*Who is Button*/}
        <div
          className="whoIsUsingThePlatform mt-10 mb-15 ml-12 md:pr-10 pr-10 md:items-center"
          style={{ display: "flex", gap: "20px" }}
        >
          {showWhoIsUsingPlatform && (
            <>
              <button
                className={`rounded-lg md:p-5 p-2 md:px-15 px-0 border-2 md:w-60 w-30 text-2xl text-center cursor-pointer 
                                ${
                                  selectWhoIsUsingPlatform === "myself"
                                    ? "text-blue-950 border-blue-950 bg-blue-400"
                                    : "text-blue-950 border-blue-950 hover:bg-blue-400 hover:text-white"
                                }`}
                onClick={() => setSelectWhoIsUsingPlatform("myself")}
              >
                Myself
              </button>

              <button
                className={`rounded-lg md:p-5 p-2 md:px-7 px-0 border-2 md:w-74 w-55 text-2xl text-center cursor-pointer '
                                ${
                                  selectWhoIsUsingPlatform === "someoneElse"
                                    ? " text-blue-950 border-blue-950 bg-blue-400"
                                    : "text-blue-950 border-blue-950 hover:bg-blue-400 hover:text-white"
                                }`}
                onClick={() => setSelectWhoIsUsingPlatform("someoneElse")}
              >
                Someone Else
              </button>
            </>
          )}
          {errorWhoIsUsingPlatform && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {errorWhoIsUsingPlatform}
            </p>
          )}
        </div>

        {/*SignUpAs*/}
        <div
          className="whoIsUsingPlatform mt-10 md:mb-50 mb-30 md:mr:20 ml-12 md:ml:20 md:flex-row flex-col"
          style={{ display: "flex", gap: "20px" }}
        >
          <button
            onClick={() => createUser("Tenant")}
            className="signUpTenant bg-blue-950 hover:bg-blue-800 text-white rounded-lg p-4 w-75 md:w-60 border-1px solid #ccc text-2xl text-center cursor-pointer"
          >
            Sign Up as Tenant
          </button>

          <button
            onClick={() => createUser("Landlord")}
            className="signUpLandlord bg-blue-950 hover:bg-blue-800 text-white rounded-lg p-4 w-75 md:65 border-1px solid #ccc text-2xl text-center cursor-pointer"
          >
            Sign Up as Landlord
          </button>
        </div>
      </div>

      {/*Banner Section*/}
      <div className="bannerSection md:flex md:justify-right md:items-right -mt-10 md:-mt-295 ml-10 md:ml-190 md:mb-30 mb-10 md:w-100% w-50% md:mr-10 mr-10">
        {/* RIGHT SECTION */}
        <div
          className={"relative h-80 rounded-2xl shadow-lg bannerBgColor mb-170"}
        >
          <div
            className={
              "relative p-10 rounded-t-2xl md:w-153.5 w-50% bg-[rgba(0,51,153,1)] py-13 leading-relaxed bannerBgColor "
            }
          >
            <h2 className="font-medium md:text-5xl text-2xl text-white leading-10 md:leading-17 px-0.2 md:px-2 text-justify md:text-center">
              <b>
                Sign up on Okuper to connect directly with landlords and
                tenants.
              </b>
            </h2>
          </div>

          <p className="absolute md:font-medium leading-[1.5] -mt-10 md:text-[20px] text-white text-center px-5 md:px-20 text-xl md:text-center">
            No agents. No hidden fees. Just verified people and real homes.
          </p>

          {/* RIGHT BANNER IMAGES */}
          <img
            src={BASE_URL + "/bannerlady_uzwewr"}
            alt="bannerlady"
            className={
              "bannerLady md:h-auto h-60 md:w-155 w-75 bottom-[-315px] md:bottom-[-721px]"
            }
            style={{ position: "absolute", height: "auto" }}
          />

          <img
            src="/BannerSam.png"
            alt="Ad Banner Sam"
            className={"rounded-b-2xl"}
          />
        </div>
      </div>

      {/*End of Banner Section*/}
    </>
  );
};

export default page;
