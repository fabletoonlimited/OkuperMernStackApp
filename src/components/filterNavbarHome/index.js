"use client";
import React, { useState } from "react";
import { prices, ratings, categories, propertiesType } from "../../data/constants";

function FilterNavbarIndex() {
  const [category, setCategory] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [price, setPrice] = useState("all");
  const [rating, setRating] = useState("all");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");

  const inputStyle =
    "w-40 h-10 border rounded-lg px-3 text-white outline-none focus:ring-2 focus:ring-blue-500";
  
  const inputStyle2 =
    "w-40 h-10 rounded-lg px-3 text-blue-800 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <>
      {/* 🔵 Filters Section */}
      <div className="w-full bg-blue-900 text-white px-13 py-6">
        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-28 flex-wrap">
          {/* Search Input */}
          <div>
            <label className="block mb-1 text-sm">Search</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className={`${inputStyle} w-56`}/>
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 text-sm">Category</label>
            <select
              className={inputStyle}
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block mb-1 text-sm">Property Type</label>
            <select
              className={inputStyle}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}>
              <option value="all">All</option>
              {propertiesType.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 text-sm">Price</label>
            <select
              className={inputStyle}
              value={price}
              onChange={(e) => setPrice(e.target.value)}>
              <option value="all">All</option>
              {prices.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ratings */}
          <div>
            <label className="block mb-1 text-sm">Ratings</label>
            <select
              className={inputStyle}
              value={rating}
              onChange={(e) => setRating(e.target.value)}>
              <option value="all">All</option>
              {ratings.map((r) => (
                <option key={r} value={r}>
                  {r} star{r > 1 ? "s" : ""} & up
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>


      {/* 🟡 Sort Outside Blue Box */}
      <div className="flex items-center mt-6 px-12 pb-2 text-md font-bold text-gray-700 justify-end">
        <div>
          Sort{" "}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={inputStyle2}>
            <option value="featured">Homes for you</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="toprated">Tenant Reviews</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default FilterNavbarIndex;
