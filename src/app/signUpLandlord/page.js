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
                <ToastContainer position="top-center" autoClose={3000} />

                {error && (
                    <p className="text-red-600 text-lg text-center">{error}</p>
                )}

                <div className="w-full min-h-screen bg-white py-16">
                    {/* ONE FLEX CONTAINER */}
                    <div className="max-w-7xl mx-auto px-12 flex flex-col lg:flex-row items-start gap-20">
                        {/* ================= LEFT SIDE ================= */}
                        <div className="w-full lg:w-1/2">
                            <h1 className="font-bold text-4xl mb-6">
                                Signup as Landlord
                            </h1>

                            <p className="text-lg mb-6">
                                Already have an account?{" "}
                                <Link href="/signInLandlord">
                                    <span className="text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer">
                                        Sign In
                                    </span>
                                </Link>
                            </p>

                            {/* FORM CARD */}
                            <div className="border rounded-xl p-10 shadow-md">
                                <label className="block mb-2 font-medium">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-300 p-3 rounded w-full mb-6"
                                />

                                <label className="block mb-2 font-medium">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-300 p-3 rounded w-full mb-6"
                                />

                                <label className="block mb-2 font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-300 p-3 rounded w-full mb-6"
                                />

                                <label className="block mb-2 font-medium">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-300 p-3 rounded w-full mb-6"
                                />

                                <label className="block mb-2 font-medium">
                                    Referral Code (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="referralCode"
                                    value={formData.referralCode}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-300 p-3 rounded w-full mb-6"
                                />

                                <label className="block mb-2 font-medium">
                                    How did you hear about Okuper?
                                </label>
                                <input
                                    type="text"
                                    name="survey"
                                    value={formData.survey}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-300 p-3 rounded w-full mb-6"
                                />

                                {/* Terms */}
                                <div className="flex items-start gap-3 mt-4">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) =>
                                            setTermsAccepted(e.target.checked)
                                        }
                                        className="w-5 h-5 accent-blue-700 mt-1"
                                    />
                                    <span className="text-sm">
                                        By signing up, you agree to Okuper's{" "}
                                        <a
                                            href="/termsOfService"
                                            className="text-blue-600 underline">
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a
                                            href="/privacyPolicy"
                                            className="text-blue-600 underline">
                                            Privacy Policy
                                        </a>
                                        .
                                    </span>
                                </div>

                                <button
                                    onClick={handleSignUp}
                                    className="mt-8 w-full bg-blue-950 hover:bg-blue-800 text-white p-4 text-lg rounded-md transition">
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        {/* ================= RIGHT SIDE ================= */}
                        <div className="w-full lg:w-1/2 flex justify-end">
                            <div className="relative bg-[rgba(0,51,153,1)] rounded-2xl shadow-lg overflow-hidden">
                                {/* Blue Header */}
                                <div className="bg-[#003399] p-12 w-full text-white text-left">
                                    <h2 className="text-4xl font-semibold leading-snug">
                                        Rent & Buy your Homes Directly on Okuper
                                    </h2>
                                </div>

                                {/* Middle Text */}
                                <p className="absolute top-44 text-white text-left text-lg px-12">
                                    No agents. No hidden fees. Just verified
                                    people and real homes.
                                </p>

                                {/* Images */}
                                <img
                                    src="/bannerGirl.png"
                                    alt="Banner Girl"
                                    className="absolute -bottom-10 right-0 w-[80%] md:w-[90%] max-w-none"
                                />

                                <img
                                    src="/BannerSam.png"
                                    alt="Ad Banner Sam"
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
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
