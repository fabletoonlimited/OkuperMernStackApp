"use client";
import React, { useState } from "react";

const OtpModal = ({ isOpen, onClose, email, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call your verification API
      const response = await fetch("/api/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      if (response.ok) {
        onVerify();
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    // Call your resend OTP API
    try {
      await fetch("/api/otp/requestOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      alert("OTP resent successfully!");
    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">Verify Email</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit code sent to
          <br />
          <span className="font-semibold">{email}</span>
        </p>

        {/* OTP Input Fields */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-950 focus:outline-none"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    !digit &&
                    e.target.previousSibling
                  ) {
                    e.target.previousSibling.focus();
                  }
                }}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-center mb-4 text-sm">{error}</p>
          )}


          {/* Verify Button */}
          <Link href="/signUpTenant" className="mb-4 text-blue-700 underline">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-950 hover:bg-blue-800 text-white p-3 rounded-lg text-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          </Link>
          
        </form>

        {/* Resend Link */}
        <p className="text-center mt-4 text-sm">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            className="text-blue-600 hover:underline font-semibold"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpModal;
