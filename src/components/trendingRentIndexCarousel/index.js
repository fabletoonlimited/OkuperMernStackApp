"use client";
import React, { useEffect, useState } from "react";
import PropertyCard from "../propertyCard/index";
import AdBanner from "../listingAdCard/index";
import { insertAdBanners } from "../../utils/insertAdBanners";

const TrendingRentIndexCarousel = () => {
    const [propertyItems, setPropertyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch("/api/property");
                const data = await res.json();

                if (!res.ok) {
                    console.error(data.message || "Failed to fetch properties");
                    return;
                }

                const list = Array.isArray(data) ? data : data.properties;

                // ✅ Filter only rent
                const filtered = list.filter(
                    (property) => property.category === "Rent"
                );

                // OPTIONAL: insert ads
                const mixed = insertAdBanners(filtered);

                setPropertyItems(mixed);
            } catch (err) {
                console.error("Error loading properties:", err);
                setError("Failed to load properties.");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, []);

    // ✅ Slice AFTER fetching
    const slicedProperties = propertyItems.slice(0, 9);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (slicedProperties.length === 0) return null;

    return (
        <div className="flex gap-4 w-fit mx-auto overflow-x-auto h-auto py-8 mb-20 px-2">
            {slicedProperties.map((item, index) =>
                item.isAd ? (
                    <div
                        key={item._id || `ad-${index}`}
                        className="w-80 flex-shrink-0"
                    >
                        <AdBanner
                            desc={item.desc}
                            topic={item.topic}
                            btn={item.btn}
                        />
                    </div>
                ) : (
                    <div
                        key={item._id}
                        className="w-80 flex-shrink-0"
                    >
                        <PropertyCard {...item} />
                    </div>
                )
            )}
        </div>
    );
};

export default TrendingRentIndexCarousel;