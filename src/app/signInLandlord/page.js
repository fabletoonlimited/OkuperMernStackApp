"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Page = () => {
  const router = useRouter();

  //Auth code session not signing out
  useEffect(() =>{
    const checkAuth = async () => {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });
  
    if (res.ok) {
      router.replace("/landlordDashboard")
    }};
    checkAuth();
  }, []);

  // State for form and modal
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handler
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/loginLandlord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        setLoading(false);
        return;
      }

      setTimeout(() => {
        toast.success("🚀 Redirecting to landlord dashboard...");
        router.push("/landlordDashboard");
      }, 2000);
      
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <h1
        className="font-bold text-4xl"
        style={{ paddingLeft: 45, marginTop: 70 }}
      >
        Sign in
      </h1>

    <ToastContainer position="top-center" autoClose={3000} />

      {/*SignUp Form*/}
      <div className="signInLoandingContainer md:flex-col col mt-10 mb-50">
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
          {/*Email*/}
          <p style={{ paddingTop: 20, marginBottom: 30 }}>Email Address</p>
          <input
            type="email"
            placeholder="Enter your email address"
            className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
          />

          {/*Password*/}
          <p style={{ paddingTop: 20, marginBottom: 30 }}>Password</p>
          <input
            type="password"
            placeholder="Create a password"
            className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
          />

          {/*Referral*/}
          <p style={{ paddingTop: 20, marginBottom: 30 }}>
            Referral Code (Optional)
          </p>
          <input
            type="text"
            placeholder="Enter your referral code"
            className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
          />
          <p style={{ paddingTop: 30, marginBottom: 30 }}>
            Forgot password?
            <Link href="/forgotPassword">
              <span className="cursor-pointer hover:text-blue-600">
                {" "}
                Click here
              </span>
            </Link>
          </p>
        </div>

        {/*SignIn Btn*/}
        <div className="landlordSignUpBtn mt-10 ml-12 md:ml-12 flex flex-col md:flex-row gap-5">
          <button 
            onClick={handleSignInSubmit}
            className="landlordSignInBtn bg-blue-950 hover:bg-blue-800 text-white p-4 md:w-140 w-75 border-1px text-2xl text-center cursor-pointer md:mb-20 mb-30">
            {" "}
            Sign In{" "}
          </button>
        </div>

        {/*Banner Section*/}
        <div className="bannerSection md:flex md:justify-right md:items-right -mt-10 md:-mt-240 ml-10 md:ml-190 md:mb-30 mb-10 md:w-100% w-50% md:mr-10 mr-10">
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
              No agents. No hidden fees. Connect directly with your next home
              owners on Okuper. Verified people and real homes.
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

export default Page;
