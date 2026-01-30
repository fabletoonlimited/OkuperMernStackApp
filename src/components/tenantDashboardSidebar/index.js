"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("—");
  const [loadingReferral, setLoadingReferral] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  useEffect(() => {
    const fetchReferral = async () => {
      setLoadingReferral(true);
      try {
        const res = await fetch("/api/user/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setReferralCode(data?.referralCode || "—");
        } else {
          setReferralCode("Not available");
        }
      } catch (err) {
        console.error("Referral fetch error", err);
        setReferralCode("Not available");
      } finally {
        setLoadingReferral(false);
      }
    };

    fetchReferral();
  }, []);

  const copyReferral = async () => {
    try {
      if (
        !referralCode ||
        referralCode === "—" ||
        referralCode === "Not available"
      ) {
        toast.error("No referral code available");
        return;
      }
      await navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied");
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <>
      {/* Overlay (shows only when sidebar is open) */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        ></div>
      )}

      <ToastContainer position="top-center" autoClose={2000} />

      {/* Sidebar */}
      <aside
        className={`
            tenantDashboardSidebar 
            text-white px-2 bg-blue-950 md:h-screen h-screen w-[272px]
            fixed top-0 left-0 z-50
            transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <Link href={"/"}>
          <img
            className="w-45 px-4 h-auto "
            src="/Okuper_White.png"
            alt="Okuper Logo"
          />
        </Link>
        <ul className="m-8 -mt-2 justify-between w-30 flex flex-col space-y-6 cursor-pointer">
          <Link href="/tenantDashboard">
            <li>Dashboard</li>
          </Link>

          <Link href="/helpCenter">
            <li> Help Center </li>
          </Link>

          <Link href="/savedHomes">
            <li> Saved Homes </li>
          </Link>

          <Link href="/messages">
            <li> Messages </li>
          </Link>

          <Link href="/propertyLanding">
            <li> Listings </li>
          </Link>

          <Link href="/verification">
            <li> Verification </li>
          </Link>

          <Link href="/homeInterest">
            <li> Home Interests </li>
          </Link>

          <Link
            href="#"
            onClick={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch("/api/auth/logout", {
                  method: "POST",
                  credentials: "include",
                });
                if (response.ok) {
                  toast.success("Logged out successfully");
                } else {
                  toast.error("Failed to logout. Please try again.");
                }
              } catch (error) {
                console.error("Logout error:", error);
                toast.error("An error occurred during logout");
              }
            }}
          >
            <li> Logout </li>
          </Link>

          <li className="mt-2 text-sm text-white/80">
            <div className="font-semibold text-white">Your referral code</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/10 px-2 py-1 rounded text-xs">
                {loadingReferral ? "Loading..." : referralCode}
              </span>
              <button
                className="text-xs underline hover:text-blue-200"
                onClick={copyReferral}
                disabled={loadingReferral || referralCode === "—"}
              >
                Copy
              </button>
            </div>
          </li>
        </ul>
      </aside>

      {/* Always show hamburger */}
      <button
        className="
          w-10 h-10 fixed top-4 left-4 
          z-[60] bg-white/70
          rounded-md flex items-center justify-center shadow-md
        "
        onClick={toggleSidebar}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
    </>
  );
};

export default index;
