import React from 'react';
import Image from 'next/image';
// import property from '../../data/property'
import StarRating from '../starRating/starRating'

export default function PropertyCard({
  img,
  unitsAvailable,
  price,
  desc,
  location,
  category,
  rating,
  numberOfBed,
  propertyType,
  numberOfBath,
  verified,
}) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm">
      <div className="relative h-56 w-full">
        <Image
          src={img}
          alt={desc || "Property Image"}
          layout="fill"
          objectFit="cover"
        />
        {unitsAvailable && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            {unitsAvailable} units available
          </div>
        )}
        {verified && (
          <div className="absolute top-2 right-2 bg-white text-blue-600 p-1 rounded-full shadow">
            ✓
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">₦{price.toLocaleString()} / yr</h3>
        <p className="text-sm text-gray-600">{desc}</p>
        <p className="text-sm font-medium text-blue-700 mt-1">{location}</p>
        <p className="text-sm text-gray-500">For {category}</p>

        <div className="ratings mt-1">
          <StarRating rating={rating} />
        </div>
        <div className="flex gap-2 mt-2">
          <span className="text-sm bg-blue-900 text-white px-2 py-1 rounded">{numberOfBed} Bdr</span>
          <span className="text-sm bg-blue-900 text-white px-2 py-1 rounded">{propertyType}</span>
          <span className="text-sm bg-blue-900 text-white px-2 py-1 rounded">{numberOfBath} Bath</span>
        </div>
      </div>
    </div>
  );
}
