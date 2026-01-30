"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import SubscriptionModal2 from "../../components/subscriptionModal2"
import { useRouter } from "next/navigation";

const index = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setLoading(false);
    }, []);

    // Generate 
    const handleDP = async () => {
    try{
        const res = await fetch("/api/property", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              displayPic: "placeholder.jpg"
            }),
        });
    
        if (!res.ok) {
            toast.error("Failed to generate DisplayPic.");
            return;
        }
    
        await res.json();
        setIsUploaded(true);
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <div className="bg-white md:w-[1300px] md:h-[2098px] h-210 m-8">
            {/* Grid container */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:px-50">
                <div className="flex flex-col items-center mt-8"> 
                    {/* 🔐 THUMBNAIL SECTION */}              
                    {!loading && (
                    <>
                        {!isUploaded ? (
                            <div 
                                className="md:w-60 md:h-60 w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center"
                                style={{ cursor: "pointer" }}
                            >
                                <span className="md:text-[200px] text-7xl font-bold text-gray-400">
                                    +
                                </span>
                            </div>
                        ) : (
                               {handleDP}
                            )}

                            <Link href="/propertyListingUploadForm">
                                <button className="mt-4 bg-blue-700 text-white px-6 py-2 md:px-10 md:py-4 md:text-xl rounded cursor-pointer font-medium">
                                    Start uploading
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
                            Start uploading
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
                        className="mt-4 bg-blue-700 text-white md:px-10 md:py-4 px-6 py-2 rounded cursor-pointer md:text-xl font-medium">
                        Start uploading
                    </button>
                    {/* Modal Component */}
                        <SubscriptionModal2
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                        />
                </div>
            </div>
        </div>
    );
              
}

export default index