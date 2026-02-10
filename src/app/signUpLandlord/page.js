"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import OtpLandlord from "@/components/otpLandlord";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("userId");
  const residencyStatus = searchParams.get("residencyStatus");
  const whoIsUsingPlatform = searchParams.get("whoIsUsingPlatform");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    survey: "",
    referralCode: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showOtpLandlord, setShowOtpLandlord] = useState(false);
  const [error, setError] = useState("");

  //Auth code session not signing out
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me/", {
        credentials: "include",
      });

      if (res.ok) {
        router.replace("/landlordDashboard");
      }
    };
    checkAuth();
  }, []);

  // 🔒 HARD GUARD — PREVENT BROKEN FLOW
  useEffect(() => {
    if (!userId) 
      return;
    
    if (!residencyStatus || !whoIsUsingPlatform) {
      toast.error("Signup flow is invalid. Please restart signup.");
    }
  }, [userId, residencyStatus, whoIsUsingPlatform]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      toast.error("Signup flow is invalid. Please restart signup.");
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    // if (formData.password.length < 8) {
    //   toast.error("Password must be at least 8 characters");
    //   return;
    // }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    try {
      // Create landlord
      const landlordRes = await fetch("/api/landlord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          survey: formData.survey,
          referralCode: formData.referralCode,
          terms: termsAccepted,
        }),
      });

      const landlord = await landlordRes.json();

      if (!landlordRes.ok) {
        toast.error(landlord.message || "Failed to create landlord");
        return;
      }
    
      // Generate and send OTP
      const otpRes = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          email: formData.email,
          purpose: "verifyAccount",
          userType: "landlord",
        }),
      });

      if (!otpRes.ok) {
        toast.error("Failed to generate OTP. Please try again.");
        return;
      }

      const otpData = await otpRes.json();
      console.log("OTP sent to email:", formData.email);

      // Open OTP modal
      setShowOtpLandlord(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleOtpVerification = async (otpCode) => {
    if (!otpCode) return;

    console.log("Verifying OTP:", otpCode, "for email:", formData.email);

    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: formData.email,
          code: otpCode,
          purpose: "verifyAccount",
          userType: "landlord",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("OTP verification failed:", data);
        toast.error(data.message || "Invalid OTP or expired");
        throw new Error(data.message || "Invalid OTP");
      }

      // Update landlord to verified
      const updateRes = await fetch("/api/landlord", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          isVerified: true,
        }),
      });

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        console.error("Failed to update landlord:", updateData);
        toast.error("Verification successful but failed to update account");
        return;
      } else {
        console.log("✅ Landlord updated to verified");
        toast.success("Account verified successfully! 🎉");
        setShowOtpLandlord(false);
      }

      // Redirect to landlord signin page
      setTimeout(() => {
        toast.success("🚀 Redirecting to sign in page...");
        router.push("/signInLandlord");
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed");
    }
  };
  return (
    <>
      <h1
        className="font-bold text-4xl pr-10"
        style={{ paddingLeft: 45, marginTop: 70 }}
      >
        Signup as Landlord
      </h1>

      {/*Already have account - Sign In Link*/}
      <div className="signInLinkSection ml-12 mt-3">
        <p className="text-lg">
          Already have an account?{" "}
          <Link href="/signInLandlord">
            <span className="text-blue-600 hover:text-blue-800 underline cursor-pointer font-semibold">
              Sign In
            </span>
          </Link>
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />

      {error && <p className="text-red-600 ml-12 mt-4 text-lg">{error}</p>}

      {/*SignUp Form*/}
      <div className="signUpLoandingContainer md:flex-col col mt-10 mb-50">
        <div
          className="landlordSignupFormSection text-2xl mt-10 mb-10 md:w-100% w-50% md:mr-10 mr-10"
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "556px",
            // width: '100%',
            height: "auto",
            maxHeight: "100%",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "5px",
            paddingLeft: "35px",
            paddingRight: "50px",
            marginTop: "20px",
            marginLeft: "50px",
            paddingBottom: "80px",
          }}
        >
          {/*First Name*/}
          <p style={{ paddingTop: 40, marginBottom: 30 }}>First Name</p>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter first name"
            className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
          />

          {/*Last Name*/}
          <p style={{ paddingTop: 20, marginBottom: 30 }}>Last Name</p>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter last name"
            className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
          />

          {/*Email*/}
          <p style={{ paddingTop: 20, marginBottom: 30 }}>Email</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="username@gmail.com"
            className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
          />

          {/*Password Confirmation*/}
          <p style={{ paddingTop: 20, marginBottom: 30 }}>Password</p>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="password"
            className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
          />

          <p style={{ paddingTop: 20, marginBottom: 30 }}>
            Referral Code (Optional)
          </p>
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleInputChange}
            placeholder="Enter referral code"
            className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
          />

          <p style={{ paddingTop: 20, marginBottom: 30 }}>
            How did you hear about Okuper
          </p>
          <input
            type="text"
            name="survey"
            value={formData.survey}
            onChange={handleInputChange}
            placeholder="E.g., Social Media, Friend, Advertisement"
            className="border-2 border-gray-300 p-3 rounded w-60 md:w-120 surveyInputField"
          />
        </div>

        {/*Terms*/}
        <div className="termsSection -mt-11 md:mt-10 md:ml-13 ml-13 mr-10 md:mr-0 flex items-center">
          <input
            type="checkbox"
            // id="agreeTerms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-7 h-7 border-2 border-blue-950 rounded cursor-pointer accent-blue-700"
          />
          {/*Terms Text*/}
          <span className="text-sm ml-2 md:ml-2 mr-0 md:mr-12 md:mt-0 mt-5">
            By signing up, you agree to Okuper's{" "}
            <a href="/termsOfService" className="text-blue-600 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacyPolicy" className="text-blue-600 underline">
              Privacy Policy
            </a>
            .
          </span>
        </div>

        {/*SignUp Btn*/}
        <div className="landlordSignUpSection mt-10 ml-12 md:ml-12 flex flex-col md:flex-row gap-5">
          <button
            onClick={handleSignUp}
            email={formData.email}
            className="landlordSignUpBtn bg-blue-950 hover:bg-blue-800 text-white p-4 md:w-140 w-75 border-1px text-2xl text-center cursor-pointer md:mb-20 mb-30"
          >
            {" "}
            Sign Up{" "}
          </button>
        </div>

        {/*Banner Section*/}
        <div className="bannerSection md:flex md:justify-right md:items-right -mt-10 md:-mt-290 ml-10 md:ml-190 md:mb-30 mb-10 md:w-100% w-50% md:mr-10 mr-10">
          {/* RIGHT SECTION */}
          <div
            className={
              "relative h-80 rounded-2xl shadow-lg bannerBgColor mb-170"
            }
          >
            <div
              className={
                "relative p-10 rounded-t-2xl md:w-153.5 w-50% bg-[rgba(0,51,153,1)] py-13 leading-relaxed bannerBgColor "
              }
            >
              <h2 className="font-medium md:text-5xl text-2xl text-white leading-10 md:leading-17 px-0.2 md:px-2 text-center">
                <b>Rent & Buy your Homes Directly on Okuper</b>
              </h2>
            </div>

            <p className="absolute md:font-medium leading-[1.5] -mt-10 md:text-[20px] text-white text-center px-5 md:px-20 text-xl md:text-center">
              No agents. No hidden fees. Just verified people and real homes.
            </p>

            {/* RIGHT BANNER IMAGES */}
            <img
              src="/bannerGirl.png"
              alt="bannerGirl"
              className={
                "bannerGirl md:h-auto h-60 md:w-110 w-50 bottom-[-275px] md:bottom-[-721px]"
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
      </div>

      {/* OTP MODAL */}
      {showOtpLandlord && (
        <OtpLandlord
          isOpen={true}
          onClose={() => setShowOtpLandlord(false)}
          email={formData?.email ?? ""}
          onVerify={handleOtpVerification}
        />
      )}
    </>
  );
};

export default page;
