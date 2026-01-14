"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const OtpLandlord = ({ isOpen, onClose, email, onVerify }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      await onVerify(otp);
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
          action: "requestOtp",
          email: email,
          userType: "Landlord",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP resent successfully");
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Account</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP Code"
            maxLength={6}
            className="border-2 border-gray-300 p-3 rounded text-center text-xl tracking-widest"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-950 text-white p-3 rounded hover:bg-blue-800 disabled:bg-gray-400"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Cancel
          </button>
          <button onClick={handleResendOtp} className="text-blue-600 hover:underline">
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpLandlord;
