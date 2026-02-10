"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import SubscriptionModal2 from "../../components/subscriptionModal2";
import { useRouter } from "next/navigation";

const index = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [profilePercent, setProfilePercent] = useState(null);

  // landlord state
  const [landlordEmail, setLandlordEmail] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [propertyCount, setPropertyCount] = useState(0);

  // ✅ get logged in landlord
  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) return;

        // adjust depending on your response shape
        const email = data?.user?.email || data?.email;
        setLandlordEmail(email || null);
      } catch (err) {
        console.error("Auth me error:", err);
      }
    };

    getMe();
  }, []);

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const res = await fetch("/api/profile/completion", {
          credentials: "include",
        });

        if (!res.ok) {
          setProfilePercent(null);
          return;
        }

        const data = await res.json();
        setProfilePercent(Number.isFinite(data.percent) ? data.percent : 0);
      } catch (err) {
        console.error("Profile completion error:", err);
        setProfilePercent(null);
      }
    };

    fetchCompletion();
  }, []);

  // ✅ fetch subscription + property count once we have landlord email
  useEffect(() => {
    if (!landlordEmail) return;

    const fetchSubscriptionAndProperties = async () => {
      try {
        // 1) subscription
        const subRes = await fetch("/api/landlordSubscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "check",
            email: landlordEmail,
            cardNo: "0000",
            cvv2: "000",
            expDate: "00/00",
          }),
        });

        const subData = await subRes.json();

        if (subRes.ok) {
          setIsSubscribed(subData?.subscribed === true);
        }

        // 2) properties
        const propRes = await fetch("/api/property", {
          method: "GET",
          cache: "no-store",
        });

        const propData = await propRes.json();

        if (propRes.ok) {
          const all = propData?.properties || [];

          // only count properties uploaded by this landlord
          const mine = all.filter(
            (p) =>
              p?.landlord?.email === landlordEmail ||
              p?.landlordEmail === landlordEmail,
          );

          setPropertyCount(mine.length);
        }
      } catch (err) {
        console.error("Fetch subscription/properties error:", err);
      }
    };

    fetchSubscriptionAndProperties();
  }, [landlordEmail]);

  // ✅ this is what controls upload access
  const handleUploadClick = async (e) => {
    e.preventDefault();

    if (checking) return;
    setChecking(true);

    try {
      // if not subscribed and already uploaded 1 property -> block
      if (!isSubscribed && propertyCount >= 1) {
        setIsOpen(true);
        return;
      }

      // allowed
      router.push("/propertyListingLanding");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="md:mt-10 p-2 pr-4 md:px-12 ">
      <div className="landlordDashboardCard grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-4">
        <div
          className="items-center space-y-2 rounded-lg bg-white md:w-[310px] w-46 md:h-[250px] h-auto p-5 md:p-8 mb-4"
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <h4 className="font-black md:text-2xl text-xl md:leading-7 mb-3">
            Your profile
          </h4>
          <p className="md:text-justify">
            {profilePercent === null
              ? "Your profile information is loading"
              : `Your profile information is ${profilePercent}% complete`}
          </p>
          <Link
            href="/profile"
            className="bg-blue-900 rounded-xl md:p-2 p-3  text-white "
          >
            <button className="md:p-8 md:m-0 mt-3 text-sm  cursor-pointer">
              Update Your profile{" "}
            </button>
          </Link>
        </div>

        {/* ✅ Listings card (logic added, UI unchanged) */}
        <div
          className=" md:px-10 space-y-2 rounded-lg bg-white md:w-[310px] md:h-[250px] h-auto p-5 md:p-8 mb-4 w-46"
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <h4 className="font-black md:text-2xl text-xl leading-7 mb-3">
            Listings
          </h4>
          <p className="text-justify">
            Add your property listings to showcase it to tenants
          </p>

          {/* 👇 changed only this part: Link -> button */}
          <button
            onClick={handleUploadClick}
            className="bg-blue-900  md:p-2 p-3 rounded-xl  text-white "
          >
            <span className="md:p-8 md:m-0 mt-3 cursor-pointer text-sm block">
              Upload Your property{" "}
            </span>
          </button>

          {/* Modal */}
          <SubscriptionModal2
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>

        <div
          className="md:px-10 -space-y-3 rounded-lg bg-white md:w-[310px] md:h-[250px] h-auto w-46 px-5 p-5 md:p-8 mb-4"
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <h4 className="font-black md:text-2xl text-xl leading-7 mb-3">
            Address Verification
          </h4>
          <p className="md:text-justify">
            Verify your listing by providing the required documentation
          </p>
          <Link
            href="./"
            className="bg-blue-900 md:p-2 p-3 rounded-xl  text-white"
          >
            <button className="md:p-8 md:m-0 mt-10 cursor-pointer text-sm ">
              Update Your profile{" "}
            </button>
          </Link>
        </div>

        <div
          className="md:px-10 space-y-2 rounded-lg bg-white md:w-[310px] md:h-[250px] h-auto px-5 p-5 md:p-8 mb-4 w-46"
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <h4 className="font-black md:text-2xl text-xl leading-7 mb-3">
            Profile Picture
          </h4>
          <p className="text-justify">
            Add a profile picture to help the guests know you better
          </p>
          <Link
            href="./"
            className="bg-blue-900  md:p-2 p-3 rounded-xl  text-white "
          >
            <button className="md:p-8 md:m-0  cursor-pointer mt-8 text-sm">
              Update Your profile{" "}
            </button>
          </Link>
        </div>

        <div
          className="md:px-10 space-y-2  rounded-lg bg-white md:w-[310px] md:h-[250px] h-auto px-5 p-5 md:p-8 mb-4 w-46"
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <h4 className="font-black md:text-2xl text-xl leading-7 mb-3">
            Property Preference
          </h4>
          <p className="text-justify">
            These preferences will help us match better with homes
          </p>
          <Link
            href="./"
            className="bg-blue-900  md:p-2 p-3 rounded-xl  text-white "
          >
            <button className="md:p-8 md:m-0 mt-8 cursor-pointer text-sm">
              Update Your profile{" "}
            </button>
          </Link>
        </div>

        <div
          className=" md:px-10 rounded-lg bg-white md:w-[310px] md:h-[250px] h-auto px-5 p-5 mmd:p-8 mb-4 w-46"
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <h4 className="font-black md:text-2xl text-xl leading-7 mb-3">
            Account Details
          </h4>
          <p className="md:w-60 mt-2 md:text-justify">
            Add your account details to enable us forward your tenants payments
            after finalizing home
          </p>
          <Link
            href="./"
            className="bg-blue-900 md:p-2 p-3 rounded-xl  text-white "
          >
            <button className="md:p-8 md:m-0 mt-4 cursor-pointer text-sm">
              Update Your profile{" "}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default index;
