"use client";
import React, { useEffect, useState } from "react";
import AdBannerCard from "../../components/listingAdCard";
import PropertyCard from "../../components/propertyCard";
import FilterNavbarIndex from "../../components/filterNavbarHome";
import "../../style/globals.css";
import { insertAdBanners } from "../../utils/insertAdBanners";


function AllProperties() {
    const [propertyItems, setPropertyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await fetch("/api/property", 
                    { method: "GET" });
                    
                const data = await res.json();

                const filtered = data.filter(
                    (item) =>
                        item.img &&
                        Array.isArray(item.img) &&
                        item.img.length > 0 &&
                        item._id,
                );

            if (!res.ok) {
            console.error(data.message || "Failed to fetch properties");
            return;
            }

            const mixed = insertAdBanners(filtered);
                setPropertyItems(mixed);
            } catch (err) {
                console.error("Error loading properties:", err);
                setError("Failed to load properties.");
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    return (
        <>
            <FilterNavbarIndex />
            <main className="bg-gray-100 min-h-screen py-3 px-6 md:px-12">
                <h1 className="text-3xl font-bold text-blue-800 mb-2 text-start">
                    All Properties
                </h1>
                <p className="text-md text-blue-800 mb-6 text-start">
                    {propertyItems.filter((item) => !item.isAd).length} homes
                    available
                </p>

                {loading && (
                    <div className="text-center text-blue-600 font-semibold">
                        Loading properties...
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-600 font-semibold">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {propertyItems.map((item) =>
                            item.isAd ? (
                                <AdBannerCard key={item._id} {...item} />
                            ) : (
                                <PropertyCard key={item._id} {...item} />
                            ),
                        )}
                    </div>
                )}

                {/*buton Banner */}
                <div className="flex flex-col items-center justify-center mt-14 bg-blue-950 p-6 md:p-4 max-w-full md:max-w-6xl mx-8 md:mx-8">
                    <p className="text-2xl  text-white text-center mt-6">
                        WorkmanHQ!
                    </p>
                    <p className=" text-white text-center mt-1 font-extralight">
                        Dont let pests control you. Contact us for more details.
                    </p>
                    <button
                        className="px-4 py-3 border-1 rounded-lg mt-4 mb-2 hover:bg-blue-900 hover:scale-95 transition duration-300 ease-in-out
                        text-white text-sm   font-semibold md:text-lg">
                            {" "}
                            Get Started
                    </button>
                </div>
            </main>
        </>
    );
}

export default Rent;
