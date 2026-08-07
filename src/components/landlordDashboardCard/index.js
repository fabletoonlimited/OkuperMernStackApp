"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import SubscriptionModal2 from "../subscriptionModalProfileViewAlert";
import SubscriptionModal1 from "../subscriptionModalPropertyAlert";

import { useRouter } from "next/navigation";

const index = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [checking, setChecking] = useState(false);

  const [profilePercent, setProfilePercent] = useState(100);

  const [utilityLoading, setUtilityLoading] = useState(true);
  const [utilityCompletion, setUtilityCompletion] = useState(false);

  const [loadingListing, setLoadingListing] = useState(true);
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

    // If landlord already has a property, treat as subscribed
    if (propertyCount >= 1) {
      setIsSubscribed(true);
      return;
    }

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
}, [landlordEmail, propertyCount]);
  
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
        router.push("/propertyListingUploadForm");

      // allowed
      // router.push("/subscriptionModal1");
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      {/* Dashboard Card */}
      <div className="md:mt-10 p-4 md:px-12">
        
        <div className="landlordDashboardCard grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {profilePercent === 87 && (

          <div className="space-y-2 rounded-lg hover:rounded-none bg-white p-6 shadow-md hover:scale-105 transition-transform duration-300">
            <h4 className="text-blue-950 font-bold mb-3">Your Profile</h4>
              <p>
                {profilePercent === null
                  ? "Your profile information is loading"
                  : `Your information is ${profilePercent}% complete. Please complete your profile to enjoy full benefits.`
                }
              </p>

              <Link href="/landlordVerification">
                <div className="flex justify-center">
                  <button 
                  className="bg-blue-900 cursor-pointer hover:rounded-full px-6 py-2 w-full text-white text-sm mt-6 hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={profilePercent === 87}
                  >
                    {profilePercent === 87 ? "Uploaded" : "Update Your profile"}
                    
                  </button>
                </div>
              </Link>
          </div>
          )}

            {/* Listings */}
            {profilePercent === 87 && (
              <div className="space-y-2 rounded-lg hover:rounded-none bg-white p-6 shadow-md hover:scale-105 transition-transform duration-300">
                <h4 className="text-blue-950 font-bold mb-3">Listings</h4>

                <p>
                  { propertyCount >= 1
                    ? "You have used up your free one property upload. Subscribe to upload more properties."
                    : "Add your one free property listing to begin showcasing it to prospective tenants."
                  }
                </p>

                <div className="flex justify-center">
                  
                  <button
                    onClick={handleUploadClick}
                    className="bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed hover:rounded-full px-6 py-2 w-full text-white text-sm mt-6 cursor-pointer hover:bg-blue-800 transition"
                    disabled={loadingListing === true || propertyCount >= 1}
                  >
                    {loadingListing
                      ? "Loading..."
                      : propertyCount >=1
                      ? "Uploaded"
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

            )}

              {/* Account Details */}
            <div className="space-y-2 rounded-lg bg-white p-6 shadow-md hover:shadow-lg hover:scale-105 transition duration-300">
              <h4 className="text-blue-950 font-bold text-lg">
                Bank Account
              </h4>

              <p className="text-gray-600">
                Add your bank account details to receive tenant payments directly.
              </p>

              <Link href="/landlordAccountForm">
                <div className="flex justify-center mt-6">
                  <button
                    disabled={bankCompletion}
                    className="bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed hover:rounded-full px-6 py-2 w-full text-white text-sm mt-6 cursor-pointer hover:bg-blue-800 transition"
                  >
                    {bankCompletion ? "Account Added" : "Add Bank Account"}
                  </button>
                </div>
              </Link>
            </div>

              {/*Advert */}
                <Link href={""}>
                  <div className="h-30 w-150 bg-amber-500 mt-14 mb-6 ml-70 justify-center items-center px-6">
                    <p className="justify-center items-center pt-12 pl-10">Video Advert goes here...</p>
                  </div>
                </Link>
          
              {/* Subscription */}
                {/* {profilePercent === 87 && (
                <div className="space-y-2 rounded-lg hover:rounded-none bg-white p-6 shadow-md hover:scale-105 transition-transform duration-300">
                  <h4 className="text-blue-950 font-bold mb-3">Subscribe</h4>

                <p>
                  Subscribe to our monthly package for you to be able to enjoy
                  full benefits
                </p> */}
                {/* <Link href="#">
                  <div className="flex justify-center ">
                    <button 
                        className="bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 w-full text-white text-sm mt-6"
                    >
                      Coming soon
                    </button>
                  </div>
                </Link> */}
              {/* </div> */}
              {/* )} */}
          </div>
        </div>
    </>
  );
};

export default index;
