

"use client";
import React from "react";
import { useEffect } from "react"
import {useState} from "react"

const Page = () => {
    const [tenant, setTenant] = useState([])
    const [landlord, setLandlord] = useState([]);
    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const req = await fetch("/api/landlord");
                const data = req.json();

                if (!req) {
                    if (!res.ok) return;
                setLandlord(data);
                }
            }
            catch (err) {
                console.error("Error loading landlord details:", err);
                setError("Failed to load landlord details");
            }
            
            fetchTenant();
        }
        },[]);
    
    return (
      <div className="mt-12 mb-12">
      <div className="flex items-center justify-center">
          {/* Card */}
          <div className="w-[320px] bg-white rounded-2xl shadow-md p-5 relative text-center">
              {/* Close */}
              <button className="absolute top-3 right-3 text-gray-500">
                  x
              </button>

              {/* Avatar */}
              <img
                  src="/profile.jpg"
                  alt="profile"
                  className="w-20 h-20 rounded-full mx-auto object-cover"
              />

              {/* Name */}
              <h2 className="mt-3 font-semibold text-lg">{landlord.firstName} {landlord.lastName
              }</h2>

              {/* Role */}
              <p className="text-green-600 font-medium text-sm">{landlord.role}</p>

              {/* Email */}
              <p className="text-sm mt-2">
                  <span className="font-semibold">Email:</span>{}
                  {landlord.email}
              </p>

              {/* Phone */}
              <p className="text-sm">
                  <span className="font-semibold">Phone:</span> 08123456747
              </p>

              <div className="my-3 border-t"></div>

              {/* Document */}
              <p className="text-sm font-semibold">Document type: NIN</p>
              <p className="text-xs text-gray-600 mb-2">ID No: 456575903</p>

              <img
                  src="/idcard.png"
                  alt="id"
                  className="w-full h-16 object-cover rounded-md"
              />
              <div className="my-3 border-t"></div>

              {/* Info Section */}
              <div className=" justify-center  text-sm">
                  <p>
                      <span className="font-semibold">Gender:</span> Female
                  </p>
                  <p>
                      <span className="font-semibold">Age:</span> 32 Years
                  </p>
                  <p>
                      <span className="font-semibold">Religion:</span>Muslim 
                  </p>
                  
                  <div className="my-3 border-t"></div>
                  <p className="text-sm mt-2">
                      <span className="font-semibold">No of Children:</span>{" "}
                      titilolag@gmail.com
                  </p>
                  <p className="text-sm mt-2">
                      <span className="font-semibold">Religion:</span> Muslim
                  </p>
               
                  <div className="text-sm mt-2">
                      <p className="font-semibold">Property Address</p>
                     <p>isaga road</p>
                  </div>

                
                  <p className="text-sm mt-2">
                      <span className="font-semibold">City:</span> Lagos
                  </p>
                  <p className="text-sm mt-2">
                      <span className="font-semibold">State:</span> Lagos
                  </p>
                  <p className="text-sm mt-2">
                      <span className="font-semibold">Country:</span> Nigeria
                  </p>
                  <p className="text-sm mt-2">
                      <span className="font-semibold">Zip Code:</span> 100234
                  </p>
              </div>

              {/* Button */}
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">
                  Delete Profile
              </button>
          </div>
      </div></div>
  );
};

export default Page;