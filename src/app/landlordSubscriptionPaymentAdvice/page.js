

"use client";
import React from "react";
import { useEffect } from "react"
import {useState} from "react"

const Page = () => {
    const [landlord, setLandlord] = useState([])
    const [property, setProperty] = useState([]);
    useEffect(() => {
        const fetchlandlord = async () => {
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
            
            fetchlandlord();
        }
    }, []);
    useEffect(() => {
               
                const fetchProperty = async () => {
                    try {
                        const res = await fetch(`/api/property`);
                        if (!res.ok) {
                            toast.error("Failed to load property");
                            return;
                        }
                        const data = await res.json();
                        setProperty(data);
                    } catch (err) {
                       console.error("Error loading property details:", err);
                       setError("Failed to load property details");
                    } 
                };
                fetchProperty();
            }, []);
    
    return (
        <div className="mt-12 mb-12">
            <div className="flex items-center justify-center min-h-screen ">
                {/* Card */}
                <div className="w-[320px] bg-white rounded-2xl shadow-md p-5 relative text-center">
                    {/* Close */}
                    <button className="absolute top-3 right-3 text-gray-500">
                        x
                    </button>

                    {/* Avatar */}
                    <img
                        src={landlord.previewPic}
                        alt="profile"
                        className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                    <div className="flex justify-around gap-3">
                        <h2 className="mt-3 text-sm text-gray-400 flex">
                            ref: <p>{landlord.id}</p>
                        </h2>
                    </div>
                    {/* Name */}
                    <h2 className="mt-3 font-semibold text-lg">
                        {landlord.firstName} {landlord.lastName}
                    </h2>

                    <div>
                        <div className="text-xs text-green-700 font-light">
                            Successful
                        </div>
                        <div></div>
                    </div>

                    {/* Role */}
                    <p className="font-semibold">
                        Yearly Rent
                    </p>

                    {/* Email */}
                    <p className="text-sm mt-2 font-light text-gray-400 mb-2">
                        {landlord.timestamps}
                    </p>

                    {/* Phone */}
                    <p className="font-medium text-3xl">
                        {property.price}
                        <p className="font-light text-sm">
                            5% mgt fee inclusive
                        </p>
                    </p>

                    <div className="my-3 border-t"></div>

                    {/* Document */}
                    <div>
                        <p className="text-sm font-semibold mb-2"> landlord</p>
                        <p className="bg-gray-400"></p>
                    </div>

                    <p className="text-sm">
                        Type:
                        <p>{property.enum}</p>
                    </p>

                    <div className="my-3 border-gray-700 items-center"></div>
                    <p className="text-sm mt-2 mb-2 flex items-center flex-col">
                        <span className="font-semibold">Current Address</span>{" "}
                        {landlord.address}
                    </p>

                    <p className="text-sm mt-2">
                        <span className="font-semibold">City:</span>{" "}
                        {landlord.city}
                    </p>
                    <p className="text-sm mt-2">
                        <span className="font-semibold">State:</span>{" "}
                        {landlord.state}
                    </p>
                    <p className="text-sm mt-2">
                        <span className="font-semibold">Country:</span>{" "}
                        {landlord.country}
                    </p>
                    <p className="text-sm mt-2">
                        <span className="font-semibold">Zip Code:</span>{" "}
                        {landlord.zipcode}
                    </p>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">
                        Delete Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;