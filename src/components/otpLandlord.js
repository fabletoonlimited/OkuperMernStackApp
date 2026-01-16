"use client";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const OtpLandlord = ({ isOpen, onClose, email, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or first empty
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    setLoading(true);
    try {
      await onVerify(otpCode);
    } catch (error) {
      console.error(error);
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          email: email,
          purpose: "verifyAccount",
          userType: "landlord",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP resent successfully! Check your email.");
        setOtp(["", "", "", "", "", ""]); // Clear all inputs
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]"
      onClick={onClose}
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light leading-none"
          type="button"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-950 mb-2">
            Verify Your Email
          </h2>
          <p className="text-sm text-gray-600">We've sent a 6-digit code to</p>
          <p className="text-sm font-semibold text-blue-950 mt-1">{email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-950 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline disabled:text-gray-400"
              type="button"
            >
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpLandlord;
