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

  const [selectWhoIsUsingPlatform, setSelectWhoIsUsingPlatform] = useState(null);
  const [showWhoIsUsingPlatform, setShowWhoIsUsingPlatform] = useState(false);
  const [errorWhoIsUsingPlatform, setErrorWhoisUsingPlatform] = useState(null);
  const hasCheckedAuth = React.useRef(false); // To prevent multiple auth checks
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  /* =======================
     EFFECTS
  ======================= */

  // Residency dropdown
  useEffect(() => {
    const existingUser = localStorage.getItem("existingUser");
    const role = localStorage.getItem("role");

    if (existingUser === "true") {
      if (role === "tenant") {
        setSelectResidencyStatus(localStorage.getItem("residencyStatus") || null);
        setSelectWhoIsUsingPlatform(localStorage.getItem("whoIsUsingPlatform") || null);
        router.replace("/signInTenant");
      } else if (role === "landlord") {
        setSelectResidencyStatus(localStorage.getItem("residencyStatus") || null);
        setSelectWhoIsUsingPlatform(localStorage.getItem("whoIsUsingPlatform") || null);
        router.replace("/signInLandlord");
      }
    }
  }, [router]);

  // Residency dropdown validation
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
  if (hasCheckedAuth.current) return 
    hasCheckedAuth.current = true;

  const clearStorage = () => {
    localStorage.removeItem("existingUser");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("residencyStatus");
    localStorage.removeItem("whoIsUsingPlatform");
  };

  const resumeSignup = async () => {
    try {
      const res = await fetch("/api/user/me", {
        credentials: "include",
      });

    if (res.status === 401 || !res.ok) {
      clearStorage();
      return;
    };

    const data = await res.json();

    const role = (data.role || "").toLowerCase();

    if (!role) {
      clearStorage();
      return;
    }

    if (role === "tenant") router.replace("/tenantDashboard");
    else if (role === "landlord") router.replace("/landlordDashboard");
    else if (role === "admin") router.replace("/dashboardAdmin");
    else if (role === "superadmin") router.replace("/dashboardSuperAdmin");
    
  } catch (err) {
    console.error(err);
  }
};

resumeSignup();
}, [router]);


useEffect(() => {
  if (hasCheckedAuth.current) return;
  hasCheckedAuth.current = true;
}, [router]);


 useEffect(() => {
    const checkAuth = async () => {
        setLoading(true);
        
        try {
            const res = await fetch("/api/user/me", {
            credentials: "include",
            });

        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUserRole(data.role || null); 
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (err){
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
    
  const goToSignInLandlord = () => {
    router.push("/signInLandlord");
  };

  const goToSignInTenant = () => {
    router.push("/signInTenant");
  };



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

      const normalizedRole = role.toLowerCase();

      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residencyStatus: residencyMap[selectResidencyStatus],
          whoIsUsingPlatform: selectWhoIsUsingPlatform,
          role: normalizedRole,
        }),
      });

      const data = await response.json();

      console.log("BUTTON ROLE:", role);
      console.log("NORMALIZED ROLE:", normalizedRole);
      console.log("FULL API RESPONSE:", data);
      console.log("USER ROLE:", data.role || data.user?.role);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      const userId = data._id || data.user?._id;
      const userRole = data.role || data.user?.role;
      

      localStorage.setItem("userId", userId);
      localStorage.setItem("role", userRole);
      localStorage.setItem("existingUser", "true");

      localStorage.setItem("whoIsUsingPlatform", selectWhoIsUsingPlatform);
      localStorage.setItem("residencyStatus", residencyMap[selectResidencyStatus]);

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

        <div className="residencyStatusSection text-2xl mt-10 mb-20 md:w-100% w-50% md:mr-10 mr-10"
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "556px",
            // width: '100%',
            height: "350px",
            maxHeight: "100%",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "5px",
            paddingLeft: "40px",
            paddingRight: "50px",
            marginTop: "20px",
            marginLeft: "50px",
            marginBottom: "50px",
          }}>
          <p style={{ paddingTop: 40, marginBottom: 30 }}>
            What is your residency status?
          </p>

          {selectResidencyStatus && !showResidencyStatus && (
            <p className="text-start text-muted text-2xl mb-2 px-1"
              onClick={() => setShowResidencyStatus(true)}
              style={{
                cursor: "pointer",
                borderRadius: "4px",
                border: "1px solid #ccc",
                padding: "2px",
              }}
            >
              <strong>{residencyStatus[selectResidencyStatus]}</strong> (click to change)
            </p>
          )}
          {showResidencyStatus && (
            <select
              value={selectResidencyStatus || "selectOne"}
              onChange={(e) => setSelectResidencyStatus(e.target.value)}
              style={{
                padding: "10px",
                cursor: "pointer",
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
                className={`rounded-full hover:scale-105 md:p-5 p-2 md:px-15 px-0 border-2 md:w-60 w-40 text-2xl text-center cursor-pointer 
                  ${ selectWhoIsUsingPlatform === "myself"
                    ? "text-blue-950 border-blue-950 bg-blue-900"
                    : "text-blue-950 border-blue-950 hover:bg-blue-800 hover:text-white"
                  }`}
                onClick={() => setSelectWhoIsUsingPlatform("myself")}
              >
                Myself
              </button>

              <button
                className={`rounded-full hover:scale-105 md:p-5 p-2 md:px-7 px-0 border-2 md:w-74 w-55 text-2xl text-center cursor-pointer '
                                ${
                                  selectWhoIsUsingPlatform === "someoneElse"
                                    ? " text-blue-950 border-blue-950 bg-blue-900"
                                    : "text-blue-950 border-blue-950 hover:bg-blue-800 hover:text-white"
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
          className="whoIsUsingPlatform mt-10 md:mb-50 mb-40 md:mr:20 ml-12 md:ml:20 md:flex-row flex-col"
          style={{ display: "flex", gap: "20px" }}
        >
          <button
            onClick={() => createUser("tenant")}
            className="signUpTenant bg-blue-950 hover:scale-105 hover:bg-blue-800 text-white rounded-lg hover:rounded-full p-4 w-100 md:w-64 border-1px solid #ccc text-2xl text-center cursor-pointer">
            Sign Up as Tenant
          </button>

          <button 
            onClick={() => createUser("landlord")} className="signUpLandlord bg-blue-950 hover:scale-105 hover:bg-blue-800 hover:rounded-full text-white rounded-lg p-4 w-100 md:w-70 border-1px solid #ccc text-2xl text-center cursor-pointer">
            Sign Up as Landlord
          </button>
        </div>
      </div>
      
      <p className="md:ml-12 ml-12 md:-mt-40 underline -mt-20 md:mb-20 -mb-15 text-sm md:font-sm leading-[1.5] text-gray-600 hover:text-blue-600 transition-colors duration-300"
        style={{ cursor: "pointer"}}
        onClick={() => {
          router.push("/signInTenant");
        }}> Sign In as a Tenant (if you already have an account)
      </p>
      
      <p className="md:ml-12 ml-12 -md:mt-8 underline -mt-15 text-sm md:font-sm leading-[1.5] text-gray-600 hover:text-blue-600 transition-colors duration-300"
        style={{ cursor: "pointer"}}
        onClick={() => {
          router.push("/signInLandlord");   
        }}> Sign In as a Landlord (if you already have an account)
      </p>

      {/*Banner Section*/}
      <div className="bannerSection md:flex md:justify-right md:items-right mt-30 md:-mt-200 ml-10 md:ml-190 md:mb-20 mb-10 md:w-100% w-50% md:mr-10 mr-10">
      
        {/* RIGHT SECTION */}
        <div className={"relative h-40 rounded-2xl shadow-lg bannerBgColor mb-200"}>
          <div className={"relative p-10 rounded-t-2xl md:w-155 w-50% bg-[rgba(0,51,153,1)] py-2 md:h-20 leading-relaxed bannerBgColor"}>
            <h2 className="font-medium md:text-4xl text-3xl text-white leading-8 md:leading-12 md:pt-15 pt-20 px-2 md:px-2 text-center md:text-center">
              <b>
                Sign up on Okuper to connect directly with landlords and tenants.
              </b>
            </h2>
          </div>

          <p className="absolute text-sm md:font-medium leading-[1.5] mt-5 md:mt-40 md:text-[20px] text-white text-center px-15 md:px-25 md:text-center">
            No agents. No hidden fees. Just verified people and real homes.
          </p>

          {/* RIGHT BANNER IMAGES */}
          <img
            src={BASE_URL + "/bannerlady_uzwewr"}
            alt="bannerlady"
            className={"bannerLady md:h-auto h-60 md:w-120 w-120 bottom-[-541px] md:bottom-[-654px]"}
            style={{ position: "absolute", height: "auto" }}
          />

          <img
            src="/BannerSam.png"
            alt="Ad Banner Sam"
            className={"rounded-b-2xl -mt-2 md:w-155"}
          />
        </div>
      </div>

      {/*End of Banner Section*/}
    </>
  );
};

export default page;
