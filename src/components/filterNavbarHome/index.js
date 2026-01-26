"use client";
import React, { useEffect, useState } from "react";
import { prices, ratings, categories, propertiesType } from "../../data/constants";
import {faMagnifyingGlass, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
// import router from "@/app/api/rent/route";
import {userRouter} from "next/navigation";

function FilterNavbarIndex() {
    const [filters, setFilters] = useState({
        category: "all",
        price: "all",
        rating: "all",
        propertyType: "all",
        query: "",
    });

    const pillSelect =
        "appearance-none bg-white h-14 px-4 pr-10 text-base rounded-lg border border-gray-300 flex items-center";

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // ✅ Sorting function that works for both objects and numbers/strings
    const sortOptions = (options) => {
        return [...options].sort((a, b) => {
            // If items are objects with a "value" property
            if (typeof a === "object" && typeof b === "object") {
                return a.value - b.value;
            }
            // If items are numbers (or numeric strings)
            const numA = Number(a);
            const numB = Number(b);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            // Otherwise, sort alphabetically
            return String(a).localeCompare(String(b));
        });
    };

    // ✅ Apply sorting to prices
    const sortedPrices = sortOptions(prices);

    const filterConfig = [
        { key: "category", placeholder: "For Rent", options: categories },
        { key: "price", placeholder: "Price", options: sortedPrices },
        {
            key: "rating",
            placeholder: "Bed & Bath",
            options: ratings,
            suffix: "+ stars",
        },
        {
            key: "propertyType",
            placeholder: "Home type",
            options: propertiesType,
        },
    ];
useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me/", {
        credentials: "include",
      });

      if (res.ok) {
        router.replace("/landlordDashboard");
      }
    };
    checkAuth();
  }, []);


    useEffect(() => {
        const savedHome = async () => {
        const savedHomeRes = await fetch ("/api/savedHomes", {
        credentials: "include"
        })
    }})
  
    return (
        <div className="flex items-center bg-blue-900 px-8 py-7.5 justify-center gap-5">
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
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="text-black text-lg"
                        />
                    </button>
                </Link>
            </div>

            {/* Filters */}
            {filterConfig.map(({ key, placeholder, options, suffix }) => (
                <div key={key} className="relative">
                    <select
                        className={pillSelect}
                        value={filters[key]}
                        onChange={(e) => updateFilter(key, e.target.value)}>
                        <option value="all">{placeholder}</option>

                        {options.map((option) =>
                            typeof option === "object" ? (
                                <option key={option.value} value={option.value}>
                                    {option.name}
                                </option>
                            ) : (
                                <option key={option} value={option}>
                                    {suffix ? `${option}${suffix}` : option}
                                </option>
                            ),
                        )}
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
                <img src="/houseIcon.png" alt="Home Icon" /> 
            </div>
        </div>
    );
}

export default FilterNavbarIndex;
