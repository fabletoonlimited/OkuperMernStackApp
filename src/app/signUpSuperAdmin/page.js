"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import OtpAdmin from "@/components/otpSuperAdmin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showOtpAdmin, setShowOtpAdmin] = useState(false);
  const [error, setError] = useState("");

  //Auth code session not signing out
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (res.ok) {
        router.replace("/dashboardSuperAdmin");
      }
    };
    checkAuth();
  }, []);

  // 🔒 HARD GUARD — PREVENT BROKEN FLOW
  useEffect(() => {
  if (!token) {
    toast.error("Invalid or missing invite link");
    router.push("/");
    }
  }, [token, router]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

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

    try {
      // Generate and send OTP
      const otpRes = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          email: formData.email,
          purpose: "verifyAccount",
          userType: "superAdmin",
        }),
      });

      if (!otpRes.ok) {
        toast.error("Failed to generate OTP. Please try again.");
        return;
      }

      const otpData = await otpRes.json();
      console.log("OTP sent to email:", formData.email);

      // Open OTP modal
      setShowOtpAdmin(true);
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
          userType: "superAdmin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("OTP verification failed:", data);
        toast.error(data.message || "Invalid OTP or expired");
        throw new Error(data.message || "Invalid OTP");
      }

        // Create SuperAdmin
      const superAdminRes = await fetch("/api/superAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          token
        }),
      });

      const superAdmin = await superAdminRes.json();

      if (!superAdminRes.ok) {
        toast.error(superAdmin.message || "Failed to create superAdmin");
        return;
      }

      toast.success("Account created successfully! 🎉");
      setShowOtpAdmin(false);
      router.push("/signInAdmin");

      // Update superAdmin to verified
      const updateRes = await fetch("/api/superAdmin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          isVerified: true,
        }),
      });

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        console.error("Failed to update super admin:", updateData);
        toast.error("Verification successful but failed to update account");
        return;
      } else {
        console.log("✅ Super admin updated to verified");
        toast.success("Account verified successfully! 🎉");
        setShowOtpAdmin(false);
      }

      // Redirect to Super admin signin page
      setTimeout(() => {
        toast.success("🚀 Redirecting to sign in page...");
        router.push("/signInAdmin");
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
                  Signup as Admin
                </h1>

                <p className="text-lg mb-6">
                  Already have an account?{" "}
                  <Link href="/signInAdmin">
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
                  <p className="mt-6 mb-6">
                    Forgot password?
                    <Link href="/forgotPassword">
                      <span className="ml-2 cursor-pointer text-blue-600 hover:underline">
                        Click here
                      </span>
                    </Link>
                  </p>

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
                <p className="absolute top-44 text-white text-left mt-5 text-lg px-12">
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
        {showOtpAdmin && (
          <OtpAdmin
            isOpen={true}
            onClose={() => setShowOtpAdmin(false)}
            email={formData?.email ?? ""}
            onVerify={handleOtpVerification}
          />
        )}
      </>
    );
  };

export default page;
