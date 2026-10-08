"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import SubscriptionModal2 from "../subscriptionModalProfileViewAlert";
import SubscriptionModal1 from "../subscriptionModalPropertyAlert";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";


const index = ({profilePercent}) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [checking, setChecking] = useState(false);
  const [utilityLoading, setUtilityLoading] = useState(true);
  const [utilityCompletion, setUtilityCompletion] = useState(false);

  const [loadingListing, setLoadingListing] = useState(false);
  const [uploadedListing, setUploadedListing] = useState(false);
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
        const res = await fetch("/api/user/me", {
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


    useEffect(() => {
        const fetchCompleteBankDetails = async () => {
            try {
              const res = await fetch("/api/accounts/bankDetails", {
                credentials: "include",
              });
      
              if (!res.ok) {
                setBankCompletion(false);
                return;
              }
      
              const data = await res.json();
              setBankCompletion(Boolean(data.bankDetails));
            } catch (err) {
              console.error(err);
              setBankCompletion(false);
            } finally {
              setUtilityLoading(false);
            }
          };
      
          fetchCompleteBankDetails();
      }, []);

  //Add Property listing
    useEffect(() => {
        if (!landlordId) return;

        const fetchProperties = async () => {
            try {
                setLoadingListing(true);

                const res = await fetch(
                    `/api/property?landlordId=${landlordId}`,
                    {
                        cache: "no-store",
                    }
                );

                if (!res.ok) {
                    setPropertyCount(0);
                    return;
                }

                const properties = await res.json();

                setPropertyCount(
                    Array.isArray(properties) ? properties.length : 0
                );
            } catch (err) {
                console.error(err);
                setPropertyCount(0);
            } finally {
                setLoadingListing(false);
            }
        };

        fetchProperties();
      }, [landlordId]);

    // ✅ fetch subscription + property count once we have landlord email
    useEffect(() => {
      if (!landlordEmail) return;


    const fetchSubscriptionAndProperties = async () => {
        try {
        const subRes = await fetch("/api/landlordSubscription", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            action: "check",
            email: landlordEmail,
            cardNo: "0000000000000000",
            cvv2: "000",
            expDate: "00/00",
            }),
        });

        const subData = await subRes.json();

        if (!subRes.ok) {
            setIsSubscribed(false);
            setIsOpen(true);
            return;
        }

        setIsSubscribed(subData?.subscribed === true);
        } catch (err) {
        console.error("Fetch subscription error:", err);
        setIsSubscribed(false);
        }
    };

    fetchSubscriptionAndProperties();
    }, [landlordEmail]);
  
const handleUploadClick = async (e) => {
    e.preventDefault();

    if (checking) return;

    setChecking(true);

    try {
        if (profilePercent !== 100) {
            toast.error("Please complete KYC first");
            return;
        }

        if (!subscribed && propertyCount >= 2) {
            setIsOpen(true);
            return;
        }

        router.push("/propertyListingUploadForm");
    } finally {
        setChecking(false);
    }
};

  return (
    <>
      {/* Dashboard Card */}
      <div className="md:mt-10 p-4 row md:px-12">
        <ToastContainer />
        <div className="landlordDashboardCard grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2 rounded-lg md:w-auto w-80 bg-blue-600 p-6 shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
            <h4 className="text-white font-bold mb-3">Your Profile</h4>
              <p className="text-white">
                {profilePercent === null
                  ? "Your profile information is loading"
                  : `Your information is ${profilePercent}% complete. Please complete your profile to enjoy full benefits.`
                }
              </p>

              <Link href="/landlordVerification">
                <div className="flex justify-center">
                  <button 
                  className="bg-white hover:bg-amber-400 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:rounded-full px-6 py-2 w-full text-blue0-900 text-sm mt-6 cursor-pointertransition"
                  disabled={profilePercent === 100}
                  >
                    {profilePercent === 100 ? "Uploaded" : "Update Your profile"}
                  </button>
                </div>
              </Link>
          </div>

          {/* Listings */}
            {/* {profilePercent === 100 && ( */}
              <div className="space-y-2 rounded-lg hover:rounded-none bg-amber-400 p-6 md:w-auto w-80 shadow-md hover:scale-105 transition-transform duration-300">
                <h4 className="text-blue-950 font-bold mb-3">Listings</h4>

                <p className="text-blue-950">
                  { propertyCount >= 2
                    ? "You have used up your free 2 property upload. Subscribe to upload more properties."
                    : "Add your 2 free property listing to begin showcasing it to prospective tenants."
                  }
                </p>

                <div className="flex justify-center">
                  
                  <button
                    onClick={handleUploadClick}
                    className="bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold hover:rounded-full px-6 py-2 w-full text-white text-sm mt-6 cursor-pointer hover:bg-blue-800 transition"
                    disabled={loadingListing === true || checking}
                  >
                    {loadingListing
                      ? "Loading..."
                      : !subscribed && propertyCount >=2
                      ? "Subscribe"
                      : "Add Listing"
                    }
                  </button>
                </div>

                <SubscriptionModal1
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  onContinue={() => {
                    setIsOpen(false);
                    setIsOpen2(true);
                  }}
                />

                <SubscriptionModal2
                  isOpen={isOpen2}
                  onClose={() => setIsOpen2(false)}
                />     
              </div>

          {/* Account Details */}
          <div className="space-y-2 rounded-lg md:w-auto w-80 bg-blue-600 p-6 shadow-md hover:shadow-lg hover:scale-105 transition duration-300">
            <h4 className="text-white font-bold text-lg">
              Bank Account
            </h4>

            <p className="text-white">
              Add your bank account details to receive tenant payments directly.
            </p>

            <Link href="/landlordAccountForm">
              <div className="flex justify-center">
                <button
                  disabled={bankCompletion}
                  className="bg-gray-100 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed hover:rounded-full px-6 py-2 w-full text-blue-950 font-bold text-sm mt-6 cursor-pointer transition"
                >
                  {bankCompletion ? "Account Added" : "Add Bank Account"}
                </button>
              </div>
            </Link>
          </div>
        
          {/*Advert */}
          <Link href={""}>
            <div className="h-30 bg-gray-700 md:w-295 w-80 mt-20 md:justify-center justify-left md:items-center items-left px-6">
              <p className="justify-center items-center pt-12 pl-10 text-white">Video Advert goes here...</p>
            </div>
          </Link>
        </div>

     
      </div>
    </>
  );
};

export default index;