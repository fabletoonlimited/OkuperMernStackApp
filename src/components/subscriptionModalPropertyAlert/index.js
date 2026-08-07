"use client";

import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';


const index = ({ isOpen, onClose, onContinue }) => {
    const router = useRouter();

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [landlord, setLandlord] = useState(null);
    const [landlordEmail, setLandlordEmail] = useState("");
    const [propertyCount, setPropertyCount] = useState(0);

        // Landlord
        useEffect(() => {
        if (!isOpen) 
            return;

            const fetchLandlord = async () => {
                try {
                    const res = await fetch("/api/landlord", {
                    method: "GET",
                    credentials: "include",
                    });
            
                    if (!res.ok) {
                    toast.error("Failed to fetch landlord");
                    return;
                    }
            
                    const data = await res.json();
                    setLandlord(data);
                    setLandlordEmail(data.email)
                } catch (err) {
                    console.error(err);
                    toast.error("Landlord fetch error");
                }
            };
            fetchLandlord();
        }, [isOpen]);

    // ✅ fetch subscription + property count once we have landlord email
    useEffect(() => {
        if (!isOpen || !landlordEmail) return;
    
        const fetchSubscriptionAndProperties = async () => {
            try {
                // 1) subscription
                const subRes = await fetch("/api/landlordSubscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                     email:landlordEmail, 
                    }),
                });
    
                const subData = await subRes.json();
    
                if (subRes.ok) {
                    setIsSubscribed(subData?.subscribed === true);
                }
    
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
    }, [isOpen, landlordEmail]);

    if (!isOpen) {
        return null;
    }
    
  return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-stone-900 w-[275px] h-auto py-4  flex items-center justify-center z-50">
          <div className=''>
                <div>
                    <button
                        className="absolute top-3 right-4 text-xl p-1 rounded-full w-8 h-8 text-white hover:text-blue-500 cursor-pointer"
                        onClick={onClose}>
                        x
                    </button>
                </div>

                <div className="text-center text-white space-y-4">
                    <div className=" bg-white rounded-full ml-20 w-28 h-28 m-4 justify-center">
                        <p className="text-red-600 text-center text-6xl pt-10 animate-bounce">x</p>
                    </div>
                    <h2 className='text-xl'>Error!</h2>
                        <p className="text-sm">You are on a <span className='text-xl'>FREE</span> subscription.</p>
                    <p>
                        Please upgrade your subscription <br/> to a premium plan to upload more properties.
                    </p>
                    <div className="rounded-2 mb-4">
                        <button
                            className="bg-blue-700 px-16 py-2 cursor-pointer hover:rounded-full"
                            onClick={async () => {
                                try {
                                    const res = await fetch("/api/landlordSubscription", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        credentials: "include",
                                        body: JSON.stringify({
                                            email: landlordEmail,
                                        }),
                                    });

                                    const data = await res.json();

                                    if (!res.ok) {
                                        toast.error(data.message || "Failed to initialize subscription.");
                                        return;
                                    }

                                    if (!data.paymentUrl) {
                                        toast.error("No payment URL returned.");
                                        return;
                                    }

                                    window.location.href = data.paymentUrl;
                                } catch (err) {
                                    console.error(err);
                                    toast.error("Failed to initialize subscription.");
                                }
                            }}
                        >
                            Subscribe Now
                        </button>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default index