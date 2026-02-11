"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const landlordId = localStorage.getItem("landlordId");

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`/api/property?landlordId=${landlordId}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();
        if (!res.ok) return;

        const list = Array.isArray(data) ? data : data?.properties;
        setProperties(list || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProperties();
  }, []);

  // create 3 slots
  const slots = [0, 1, 2];

  return (
    <div className="bg-white md:w-[1300px] md:h-[2098px] h-210 m-8">
      <div className="grid grid-cols-1 md:grid-cols-2 md:px-50">
        {slots.map((slotIndex) => {
          const property = properties[slotIndex] || null;
          const previewUrl = property?.previewPic || null;

          const href = property
            ? `/propertyDetails?id=${property._id}` // ✅ VIEW PROPERTY
            : "/propertyListingUploadForm"; // ✅ UPLOAD FORM

          const buttonText = property ? "Uploaded" : "Start uploading";

          return (
            <div key={slotIndex} className="flex flex-col items-center mt-8">
              {!loading && (
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

                  <Link href={href}>
                    <button className="mt-4 bg-blue-700 text-white px-6 py-2 md:px-10 md:py-4 md:text-xl rounded cursor-pointer font-medium">
                      {buttonText}
                    </button>
                  </Link>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
