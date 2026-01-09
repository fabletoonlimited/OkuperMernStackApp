"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import OtpLandlord from "@/components/otpLandlord";

const page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    survey: "",
  });
  const [showOtpLandlord, setShowOtpLandlord] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
// Added form validation for user to fill all required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.survey
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    const response = await fetch("/api/landlord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    // try {
    //   // Send OTP to user's email
    //   const response = await fetch("/api/otp?action=requestOtp", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email: formData.email }),
    //   });

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setShowOtpLandlord(true);
        
  };

  const handleOtpVerification = async (otp) => {
    // After OTP is verified, create the user account
      const response = await fetch("/api/otp?action=verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message)
        return;
      }

      // Redirect to sign in or dashboard
      window.location.href = "/signInLandlord";
  };

  return (
    <>
      <h1
        className="font-bold text-4xl pr-10"
        style={{ paddingLeft: 45, marginTop: 70 }}
      >
        Signup as Landlord
      </h1>

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
            id="agreeTerms"
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
            className="landlordSignUpBtn bg-blue-950 hover:bg-blue-800 text-white p-4 md:w-140 w-75 border-1px text-2xl text-center cursor-pointer md:mb-20 mb-30"
          >
            {" "}
            Sign Up{" "}
          </button>
        </div>

        {/* OTP Modal */}
        <OtpLandlord
          isOpen={showOtpLandlord}
          onClose={() => setShowOtpLandlord(false)}
          email={formData.email}
          onVerify={handleOtpVerification}
        />

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
    </>
  );
};

export default page;
