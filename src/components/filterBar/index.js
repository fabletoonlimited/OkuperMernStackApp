import React from 'react';

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-blue-600 text-white">
      <select
        className="bg-white text-black p-2 rounded"
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
      >
        <option value="">For Rent</option>
        <option value="sale">For Sale</option>
      </select>

      <select
        className="bg-white text-black p-2 rounded"
        value={filters.price}
        onChange={(e) => onFilterChange('price', e.target.value)}
      >
        <option value="">Price</option>
        <option value="0-1000000">Below ₦1M</option>
        <option value="1000001-5000000">₦1M - ₦5M</option>
        <option value="5000001-10000000">₦5M - ₦10M</option>
      </select>

      <select
        className="bg-white text-black p-2 rounded"
        value={filters.bedroom}
        onChange={(e) => onFilterChange('bedroom', e.target.value)}
      >
        <option value="">Bed & Bath</option>
        <option value="1">1 Bedroom</option>
        <option value="2">2 Bedrooms</option>
        <option value="3">3 Bedrooms</option>
        <option value="4">4 Bedrooms</option>
      </select>

      <select
        className="bg-white text-black p-2 rounded"
        value={filters.type}
        onChange={(e) => onFilterChange('type', e.target.value)}
      >
        <option value="">Home type</option>
        <option value="duplex">Duplex</option>
        <option value="flat">Flat</option>
        <option value="bungalow">Bungalow</option>
      </select>
    </div>
  );
}
