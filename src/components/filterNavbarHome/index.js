"use client";
import React, { useState, useEffect } from "react";
import { faMagnifyingGlass, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link"
// import {mockProperties} from "../../app/api/models/mockProperty.js";
import { useRouter } from "next/navigation";
// import property from "@/data/property.js";


function FilterNavbarIndex() {
    const [filters, setFilters] = useState({
        category: "all",
        price: "all",
        rating: "all",
        propertyType: "all",
        query: "",
    });

    const [properties, setProperties] = useState([]);

    const pillSelect = "appearance-none bg-white h-14 W-26 px-4 pr-20 text-base text-2xl rounded-lg border border-gray-300 flex items-center";

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Search helper
    const sortOptions = (options) => {
        return [...options].sort((a, b) => {
            if (typeof a === "object" && typeof b === "object") 
                return a.value - b.value;
            const numA = Number(a);
            const numB = Number(b);
            if (!isNaN(numA) && !isNaN(numB)) 
                return numA - numB;
            return String(a).localeCompare(String(b));
        });
    };

    // ✅ FETCH PROPERTIES FROM MONGODB
    useEffect(() => {
        const fetchProperties = async () => {
        try {
            const res = await fetch("./api/property",
                { method: "GET" });
            const data = await res.json();

            if (!res.ok) {
            console.error(data.message || "Failed to fetch properties");
            return;
            }

            setProperties(data.properties || []);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    fetchProperties();
  }, []);

    // ✅ Generate options dynamically 
    const categories = [...new Set(properties.map((p) => p.category))];
    const prices = sortOptions([...new Set(properties.map((p) => p.price))]);
    const ratings = [...new Set(properties.map((p) => Math.floor(p.rating)))];
    const propertiesType = [...new Set(properties.map((p) => p.propertyType))];
    const state = [...new Set(properties.map((p) => p.state))];

    const filterConfig = [
        { key: "category", placeholder: "Categories", options: categories },
        { key: "price", placeholder: "Price", options: prices },
        {
            key: "rating",
            placeholder: "Rating",
            options: ratings,
            suffix: "+ stars",
        },
        {
            key: "propertyType",
            placeholder: "Property type",
            options: propertiesType,
        },
        {
            key: "state",
            placeholder: "State",
            options: state,
        },
    ];

    const router = useRouter();

    return (
        <div className="flex items-center bg-blue-900 px-8 py-7.5 justify-around gap-6">
            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    value={filters.query}
                    onChange={(e) => updateFilter("query", e.target.value)}
                    placeholder="Search"
                    className="h-14 w-80 rounded-lg bg-white pl-4 pr-10 text-sm text-gray-700 outline-none"
                />
                <Link href={"/"}>
                    <button className="absolute right-3 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-black text-lg" />
                    </button>
                </Link>
            </div>

            {/* Filters */}
            {filterConfig.map(({ key, placeholder, options, suffix }) => (
                <div key={key} className="relative">
                    <select
                        className={pillSelect}
                        value={filters[key]}
                        onChange={(e) => updateFilter(key, e.target.value)}
                    >
                        <option value="all">{placeholder}</option>
                        {options.map((option) => (
                            <option key={option} value={option}>
                                {suffix ? `${option}${suffix}` : option}
                            </option>
                        ))}
                    </select>

                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                </div>
            ))}

            {/* Right icon */}
            <div className="h-14 flex items-center rounded-lg justify-center text-white hover:bg-white/10 gap-1 pb-3">
                <p className="text-sm mt-2 font-medium">
                    {/* `${savedHome}` */}
                    </p>
                <img src="/houseIcon.png" alt="Home Icon" className="h-10 mt-4" /> 
            </div>
        </div>
    );
}

export default FilterNavbarIndex;