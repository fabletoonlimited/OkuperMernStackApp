"use client";
import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";

export default function PropertyList() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            const res = await fetch("/api/property");
            const data = await res.json();
            setProperties(data.properties || data);
        };

        fetchProperties();
    }, []);

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {properties.map((property) => (
                <PropertyCard key={property._id} {...property} />
            ))}
        </div>
    );
}