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

    if (!subscribed && propertyCount >= 1 && !property) {
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
  const slots = [0, 1, 2,3];

  return (
    
    <div className="bg-white md:w-[1300px] md:h-[2098px] h-210 m-8">
      <div className="grid grid-cols-1 md:grid-cols-2 md:px-50 md:py-20 px-10 py-10 gap-8">
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
                className="md:w-60 md:h-60 w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden"
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

                <button 
                  onClick={() => handlePropertyCount(property)}
                  className="mt-4 bg-blue-700 text-white px-6 py-2 md:px-10 md:py-4 md:text-xl rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
                  disabled={loading === true || !!property}
                >   
                  {navigating
                    ? "Loading..."
                    : property 
                    ? "Uploaded" 
                    : "Start uploading"
                  }   
                </button>
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
