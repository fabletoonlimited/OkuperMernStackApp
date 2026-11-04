"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubscriptModal from "../subscriptionModalPropertyAlert";

const Index = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertyCount, setPropertyCount] = useState(0);
  const [subscribed, setIsSubscribed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(false);


  // const landlordId = localStorage.getItem("landlordId");
  const [landlordId, setLandlordId] = useState(null);
  useEffect(() => {
    const getMe = async () => {
      const res = await fetch("/api/user/me", {
        cache: "no-store",
        credentials: "include",
      });

      const data = await res.json();
        console.log("USER ME:", data);
      if (res.ok) {
    setLandlordId(data.actorId);
      }
    };

    getMe();
  }, []);


  // Fetch properties
  useEffect(() => {
    if (!landlordId) return;
    
    const fetchProperties = async () => {
      try {
        setLoading(true);
          const res = await fetch(`/api/property?landlordId=${landlordId}`, {
            method: "GET",
            cache: "no-store",
          });

        const data = await res.json();
        
        if (!res.ok) {
          console.error("Property fetch failed:", data);
            setProperties([]);
            setPropertyCount(0);
            return;
          }

          console.log("LANDLORD ID:", landlordId);
          console.log("MY PROPERTIES:", data);

          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.properties)
            ? data.properties
            : [];

        setProperties(list);
        setPropertyCount(list.length);

      } catch (err) {
        console.error("Property fetch error:", err);
          setProperties([]);
          setPropertyCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

  }, [landlordId]);

  const handlePropertyCount = async (property) => {
    try {
      setNavigating(true);

    if (!subscribed && propertyCount >= 2 && !property) {
      setIsOpen(true);
      return;
    }

    if (property) {
      router.push(`/propertyDetails?id=${property._id}`);
    } else {
      router.push("/propertyListingUploadForm");
    }

    } catch (err) {
      console.error(err);
    } finally {
      setNavigating(false)
    }
  }

  // create 3 slots
  const slots = [0, 1, 2, 3, 4, 5];

  return (
    
    <div className="h-auto m-8">
      <div className="grid grid-cols-1 md:grid-cols-2 md:px-50 md:py-20 px-10 py-0 gap-8">
        {slots.map((slotIndex) => {
          const property = properties[slotIndex] || null;
          const previewUrl = property?.previewPic || null;

          const href = property
            ? `/propertyDetails?id=${property._id}` // ✅ VIEW PROPERTY
            : "/propertyListingUploadForm"; // ✅ UPLOAD FORM

          const buttonText = property ? "Uploaded" : "Start uploading";

        return (
          <div key={slotIndex} className="flex flex-col items-center mt-8">
            <>
              <div
                className="md:w-60 md:h-60 w-40 h-40 bg-white rounded-full flex items-center justify-center overflow-hidden"
                style={{ cursor: "pointer" }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="md:text-[200px] text-7xl font-bold text-gray-400">
                    +
                  </span>
                )}
              </div>
              <div className="flex gap-5">
                <button 
                  onClick={() => handlePropertyCount(property)}
                  className="mt-4 bg-blue-700 text-white px-6 py-2 md:px-10 md:py-4 md:text-xl md:rounded-full rounded-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
                  disabled={loading === true || !!property}
                >   
                  {navigating
                    ? "Loading..."
                    : property 
                    ? "Uploaded" 
                    : "Start uploading"
                  }   
                </button>

                {/* EDIT UTILITY BILL */}
                {property && (
                  <button
                    onClick={() =>
                      router.push(`/utilityBillUploadPage/${property._id}`)
                    }
                    className="mt-4 bg-blue-900 text-white px-6 py-2 md:px-10 md:py-4 md:text-xl md:rounded-full rounded-none cursor-pointer font-medium hover:bg-blue-800"
                  >
                    Edit utility
                  </button>
                )}
              </div>
                
            </>
          </div>
        );
      })}
    </div>
      <SubscriptModal isOpen={isOpen} onClose={() => setIsOpen(null)} />
    </div>
  );
};

export default Index;
