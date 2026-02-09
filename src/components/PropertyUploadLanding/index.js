"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SubscriptionModal2 from "../../components/subscriptionModal2";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [latestProperty, setLatestProperty] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Fetch latest property
  useEffect(() => {
    const fetchLatestProperty = async () => {
      try {
        const res = await fetch("/api/property", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) return;

        const properties = Array.isArray(data) ? data : data?.properties;

        if (!properties || properties.length === 0) return;

        // latest created (your API sorts by createdAt desc already)
        const latest = properties[0];
        setLatestProperty(latest);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLatestProperty();
  }, []);

  const previewUrl = latestProperty?.previewPic || null;

  return (
    <div className="bg-white md:w-[1300px] md:h-[2098px] h-210 m-8">
      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:px-50">
        <div className="flex flex-col items-center mt-8">
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

              <Link href="/propertyListingUploadForm">
                <button 
                    
                    className="mt-4 bg-blue-700 text-white px-6 py-2 md:px-10 md:py-4 md:text-xl rounded cursor-pointer font-medium">
                    {latestProperty ? "Uploaded" : "Start uploading"}
                </button>
              </Link>
            </>
          )}
        </div>

        <div className="flex flex-col items-center mt-8">
          <div className="md:w-60 md:h-60 w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="md:text-[200px] text-7xl font-bold text-gray-400">
              +
            </span>
          </div>

          <Link href="/propertyListingUploadForm">
            <button className="mt-4 bg-blue-700 text-white px-6 py-2 md:px-10 md:py-4 md:text-xl rounded cursor-pointer font-medium">
              {latestProperty ? "Start uploading" : "Uploaded"}
            </button>
          </Link>
        </div>

        <div className="flex flex-col items-center mt-8">
          <div className="md:w-60 md:h-60 w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="md:text-[200px] text-7xl font-bold text-gray-400">
              +
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 bg-blue-700 text-white md:px-10 md:py-4 px-6 py-2 rounded cursor-pointer md:text-xl font-medium"
          >
            {latestProperty ? "Start uploading" : "Uploaded"}
          </button>

          <SubscriptionModal2 isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Index;
