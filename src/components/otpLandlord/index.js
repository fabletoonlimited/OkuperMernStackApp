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
      await onVerify(otpCode);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpResend = async () => {
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          email,
          purpose: "verifyAccount",
          userType: "landlord",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");
        return;
      }

      setOtp(["", "", "", "", "", ""]);
      setError("");
      alert("OTP resent successfully! Check your email.");
    } catch {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl">
          ×
        </button>

        <h2 className="text-3xl font-bold text-center mb-2">Verify Email</h2>
        <p className="text-center mb-6">{email}</p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                className="w-12 h-12 text-center text-2xl border rounded"
              />
            ))}
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-950 text-white p-3 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Didn’t receive it?{" "}
          <button onClick={handleOtpResend} className="text-blue-600 underline">
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpModal;
