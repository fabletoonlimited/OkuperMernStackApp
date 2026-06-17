"use client";
import Link from "next/link";
import React, {useState, useEffect} from "react";

const index = () => {
    const [profilePercent, setProfilePercent] = useState(null);
    const [loadingUtility, setLoadingUtility] = useState(true);
    const [uploadedUtility, setUploadedUtility] = useState(false);

useEffect(() => {
  const fetchUtilityUpload = async () => {
    try {
      setLoadingUtility(true);

      const res = await fetch("/api/uploads/utilityBill", {
        credentials: "include",
      });

      if (!res.ok) {
        setUploadedUtility(false);
        return;
      }

      const data = await res.json();

      setUploadedUtility(Boolean(data.uploaded));
    } catch (err) {
      setUploadedUtility(false);
    } finally {
      setLoadingUtility(false);
    }
  };

  fetchUtilityUpload();
}, []);

  // Profile completion
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
        setProfilePercent(data.percent || 0);
      } catch (err) {
        console.error(err);
        setProfilePercent(null);
      }
    };

    fetchCompletion();
  }, []);

  return (
      // {cards}
      <div className="md:mt-10 p-2 pr-4 md:px-12">
          <div className="tenantDashboardCard grid grid-cols-2 md:grid-cols-3 md:gap-4 gap-4">
              <div
                  className="items-center space-y-2 rounded-lg bg-white md:w-[310px] md:h-[250px] w-46 h-auto p-5 md:p-8 mb-4"
                  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                  <h4 className="font-black md:text-2xl text-xl text-center md:text-left md:leading-7 mb-3">
                      Your Profile
                  </h4>
                  <p className="text-center md:text-justify">
                      {profilePercent === null
                          ? "loading..."
                          : `Your profile is ${profilePercent}% complete`}
                  </p>
                  <Link href="/profile" className="bg-blue-900 rounded-xl md:p-2 p-3  text-white text-sm">
                        <button
                        className="md:p-8 md:m-0 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={profilePercent === 100}
                        >
                        {profilePercent === 100 ? "Uploaded" : "Update Your profile"}
                        </button>
                  </Link>
                </div>
                
                <div className=" md:px-10 space-y-2 rounded-lg bg-white md:w-[310px] md:h-[250px] w-46 h-auto p-5 md:p-8 mb-4"
                    style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                    <h4 className="font-black md:text-2xl text-xl text-center md:text-left leading-7 mb-3">
                        Utility Bill
                    </h4>
                    <p className="text-center md:text-justify">
                      {uploadedUtility
                        ? "Utility bill uploaded"
                        : "Upload your 3 months LAWMA, Water or Electricity utility bill"
                        }
                    </p>
                  <Link
                      href="/utilityBillUploadPage"
                      className="bg-blue-900  md:p-2 p-3 rounded-xl text-white text-sm">
                        <button
                            className="md:p-8 md:m-0 mt-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loadingUtility || uploadedUtility}
                            >
                            {loadingUtility ? "Checking..." : uploadedUtility ? "Uploaded" : "Upload"}
                        </button>
                  </Link>
                </div>

                <div className="md:px-10 space-y-2  rounded-lg bg-white md:w-[310px] md:h-[250px] w-46 h-auto px-5 p-5 md:p-8 mb-4" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                  <h4 className="font-black md:text-2xl text-xl text-center md:text-left leading-7 mb-3">
                      Card Details
                  </h4>
                  <p className="text-center md:text-justify">
                      Add your card details to enable quick payments. <i>(coming soon)</i>
                  </p>
                  <Link
                      href="#"
                      className="bg-blue-900/50  md:p-2 p-3 rounded-xl  text-white text-sm ">
                        <button
                            className="md:p-8 md:m-0 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                            Add card
                        </button>
                  </Link>
              </div>
          </div>
      </div>
  );
};

export default index;
