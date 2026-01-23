"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // State for request password reset form
  const [requestEmail, setRequestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // State for reset password form (when token is present)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Handle request password reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!requestEmail || !requestEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestEmail.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to send reset email");
        setLoading(false);
        return;
      }

      toast.success("Password reset email sent! Check your inbox.");
      setEmailSent(true);
      setLoading(false);
    } catch (error) {
      console.error("Request reset error:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Handle reset password with token
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      setResetLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      setResetLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setResetLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          token: token,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to reset password");
        setResetLoading(false);
        return;
      }

      toast.success("Password reset successful! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/signInLandlord");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Something went wrong. Please try again.");
      setResetLoading(false);
    }
  };

  // If token is present, show reset password form
  if (token && email) {
    return (
      <>
        <h1
          className="font-bold text-4xl"
          style={{ paddingLeft: 45, marginTop: 70 }}
        >
          Reset Password
        </h1>

        <ToastContainer position="top-center" autoClose={3000} />

        <div className="signInLoandingContainer md:flex-col col mt-10 mb-50">
          <form onSubmit={handleResetPassword}>
            <div
              className="landlordSignupFormSection text-2xl mt-10 mb-10 md:w-100% w-50% md:mr-10 mr-10"
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "556px",
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
              <p style={{ paddingTop: 20, marginBottom: 30 }}>
                New Password
              </p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
                minLength={8}
              />

              <p style={{ paddingTop: 20, marginBottom: 30 }}>
                Confirm New Password
              </p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
                minLength={8}
              />
            </div>

            <div className="landlordSignUpBtn mt-10 ml-12 md:ml-12 flex flex-col md:flex-row gap-5">
              <button
                type="submit"
                disabled={resetLoading}
                className="landlordSignInBtn bg-blue-950 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 md:w-140 w-75 border-1px text-2xl text-center cursor-pointer md:mb-20 mb-30"
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  // Default: show request password reset form
  return (
    <>
      <h1
        className="font-bold text-4xl"
        style={{ paddingLeft: 45, marginTop: 70 }}
      >
        Forgot Password
      </h1>

      <ToastContainer position="top-center" autoClose={3000} />

      <div className="signInLoandingContainer md:flex-col col mt-10 mb-50">
        {emailSent ? (
          <div
            className="landlordSignupFormSection text-2xl mt-10 mb-10 md:w-100% w-50% md:mr-10 mr-10"
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "556px",
              height: "auto",
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
            <p style={{ paddingTop: 40, marginBottom: 30, color: "#003399" }}>
              ✓ Email sent successfully!
            </p>
            <p style={{ paddingTop: 20, marginBottom: 30 }}>
              We've sent a password reset link to <strong>{requestEmail}</strong>
            </p>
            <p style={{ paddingTop: 20, marginBottom: 30 }}>
              Please check your email and click the link to reset your password.
            </p>
            <p style={{ paddingTop: 20, marginBottom: 30 }}>
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setEmailSent(false);
                  setRequestEmail("");
                }}
                className="text-blue-600 underline cursor-pointer"
              >
                try again
              </button>
            </p>
            <Link href="/signInLandlord">
              <span className="text-blue-600 underline cursor-pointer">
                Back to Sign In
              </span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRequestReset}>
            <div
              className="landlordSignupFormSection text-2xl mt-10 mb-10 md:w-100% w-50% md:mr-10 mr-10"
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "556px",
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
              <p style={{ paddingTop: 40, marginBottom: 30 }}>
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <p style={{ paddingTop: 20, marginBottom: 30 }}>
                Email Address
              </p>
              <input
                type="email"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                placeholder="Enter your email address"
                className="border-2 border-gray-300 p-3 rounded w-60 md:w-120"
                required
              />
            </div>

            <div className="landlordSignUpBtn mt-10 ml-12 md:ml-12 flex flex-col md:flex-row gap-5">
              <button
                type="submit"
                disabled={loading}
                className="landlordSignInBtn bg-blue-950 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 md:w-140 w-75 border-1px text-2xl text-center cursor-pointer md:mb-20 mb-30"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-10 ml-12">
          <Link href="/signInLandlord">
            <span className="text-blue-600 underline cursor-pointer">
              Back to Sign In
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
