"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import SubscriptionModal2 from "../../components/subscriptionModal2";
import { useRouter } from "next/navigation";
import { FaHome, FaMoneyBillWave, FaEye, FaClock } from "react-icons/fa";
// import { FaExclamationCircle, FaStar } from "react-icnons/fa";
import PropertyCard from "@/components/propertyCard";

const index = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const [profilePercent, setProfilePercent] = useState(100);

  const [utilityLoading, setUtilityLoading] = useState(true);
  const [utilityCompletion, setUtilityCompletion] = useState(false);

  const [loadingListing, setLoadingListing] = useState(true);

  const [subscribed, setIsSubscribed] = useState(false);

  const [bankCompletion, setBankCompletion] = useState(false);

  const [landlord, setLandlord] = useState(null);
  const [landlordId, setLandlordId] = useState(null);

  const [propertyCount, setPropertyCount] = useState(0);

  // landlord state
  const [landlordEmail, setLandlordEmail] = useState(null);

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

  // Landlord
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch("/api/landlord", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setLandlord(data);
        setLandlordId(data._id);

      } catch (err) {
        console.error(err);
        toast.error("Landlord fetch error");
      }
    };
    fetchLandlord();
  }, []);

  // Utility
  useEffect(() => {
    const fetchCompleteUtility = async () => {
      try {
        const res = await fetch("/api/uploads/utilityBill", {
          credentials: "include",
        });

        if (!res.ok) {
          setUtilityCompletion(false);
          return;
        }

        const data = await res.json();
        setUtilityCompletion(Boolean(data.uploaded));

      } catch (err) {
        console.error(err);
        setUtilityCompletion(false);
      } finally {
        setUtilityLoading(false);
      }
    };

    fetchCompleteUtility();
  }, []);


  //Bank Completion
  useEffect(() => {
    const fetchAddBank = async () => {
      try {
        const res = await fetch("/api/accounts/getBanks", {
          credentials: "include",
          method: "GET",
        });

        if (!res.ok) {
          setBankCompletion(false);
          return;
        }

        const data = await res.json();

        setBankCompletion(Boolean(data.getBanks));
      } catch (err) {
        console.error(err);
        setBankCompletion(false);
      }
    };

    fetchAddBank();
  }, []);

  //Add Property listing
  useEffect(() => {
  if (!landlordId) return;

  const fetchProperties = async () => {
    try {
      setLoadingListing(true);

      const res = await fetch(`/api/property?landlordId=${landlordId}`,
        {cache: "no-store"}
      );

      if (!res.ok) {
        setPropertyCount(0);
        return;
      }

      const properties = await res.json();
      
      console.log("Returned properties:", properties);
      console.log("Count:", properties.length);

      setPropertyCount(properties.length);
    } catch (err) {
      console.error(err);
      setPropertyCount(0);
    } finally {
      setLoadingListing(false)
    }
  };

  fetchProperties();
}, [landlordId]);

  //Profile completion
  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const res = await fetch("/api/landlordProfile/completion", {
          credentials: "include",
        });

        if (!res.ok) {
          setProfilePercent(null);
          return;
        }

        const data = await res.json();
        setProfilePercent(data.percent || 0);
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

          if (!subRes.ok) {
          setIsSubscribed(false);
          return;
        }
        if (subRes.ok) {
          setIsSubscribed(subData?.subscribed === true);
        }

        // 2) properties
        // const propRes = await fetch("/api/property", {
        //   method: "GET",
        //   cache: "no-store",
        // });

        // const propData = await propRes.json();

        // if (propRes.ok) {
        //   const all = propData?.properties || [];

        //   // only count properties uploaded by this landlord
        //   const mine = all.filter(
        //     (p) =>
        //       p?.landlord?.email === landlordEmail ||
        //       p?.landlordEmail === landlordEmail,
        //   );

        //   setPropertyCount(mine.length);
        // }
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
      if (!subscribed && propertyCount >= 1) {
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
    <>
      <div className="md:mt-10 p-4 md:px-12">
        <div className="landlordDashboardCard grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
            <h4 className="text-blue-950 font-bold mb-3">Your Profile</h4>
              <p>
                {profilePercent === null
                  ? "Your profile information is loading"
                  : `Your profile information is ${profilePercent}% complete`
                }
              </p>

              <Link href="/landlordVerification">
                <div className="flex justify-center">
                  <button className="bg-blue-900 cursor-pointer rounded-xl px-6 py-2 w-full text-white text-sm mt-6 hover:bg-blue-800 transition">
                    {profilePercent === 100 ? "Uploaded" : "Update Your profile"}
                  </button>
                </div>
              </Link>
          </div>

            {/* Listings */}
            {profilePercent !== 100 && (
              <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
                <h4 className="text-blue-950 font-bold mb-3">Listings</h4>

                <p>
                  { loadingListing
                    ? "Add your property listings to showcase it to tenants"
                    : "You have used up your free one property upload. Subcribe to upload more"
                  }
                </p>

                <div className="flex justify-center">
                  
                  <button
                    onClick={handleUploadClick}
                    className="bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-6 py-2 w-full text-white text-sm mt-6 cursor-pointer hover:bg-blue-800 transition"
                    disabled={loadingListing || propertyCount >=1}
                  >
                    {loadingListing
                      ? "Loading..."
                      : propertyCount >=1
                      ? "Uploaded"
                      : "Add Listing"
                    }
                  </button>
                </div>

                <SubscriptionModal2
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                />
              </div>
            )}

            {/* Address Verification
            {profilePercent !== 100 && (
              <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
                <h4 className="text-blue-950 font-bold mb-3">
                  Address Verification
                </h4>

                <p>
                  Verify your listing by providing the required documentation
                </p>

                <Link href="/utilityBillUploadPage">
                    <div className="flex justify-center">
                        <button
                            className="md:p-8 md:m-0 mt-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loadingUtility || uploadedUtility}
                            >
                            {loadingUtility
                                ? "Checking..."
                                : uploadedUtility
                                ? "Uploaded"
                                : "Upload"
                            }
                        </button>
                    </div>
                </Link>
              </div>
            )} */}

            {/* Account Details */}
            {profilePercent !== 100 && (
              <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
                <h4 className="text-blue-950 font-bold mb-3">
                  Account Details
                </h4>

                <p>
                  Add your account details for quick tenant property payment.
                </p>

                <Link href="/">
                  <div className="flex justify-center">
                    <button className="bg-blue-900 cursor-pointer rounded-xl px-6 py-2 w-full text-white text-sm mt-6 hover:bg-blue-800 transition">
                      Add Account
                    </button>
                  </div>
                </Link>
              </div>
            )}

            {/* Subscription */}
            {profilePercent !== 100 && (
              <div className="space-y-2 rounded-lg bg-white p-6 shadow-md">
                <h4 className="text-blue-950 font-bold mb-3">Subscribe</h4>

                <p>
                  Subscribe to our monthly package for you to be able to enjoy
                  full benefits
                </p>

                <Link href="#">
                  <div className="flex justify-center ">
                    <button 
                        className="bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-6 py-2 w-full text-white text-sm mt-6"
                    >
                      Coming soon
                    </button>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
    </>
  );
};

export default index;
