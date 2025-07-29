import React from 'react';
import Image from 'next/image';
// import property from '../../data/property'
import StarRating from '../starRating/starRating'

//Cloudinary config
const NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'dzjl0siqy';


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
  const CLOUDINARY_URL= `https://res.cloudinary.com/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${img}`;

  return (
    <div className=" rounded-xl overflow-hidden shadow-md">
    <div className="relative h-56 w-full">
      <Image
        src={CLOUDINARY_URL}
        alt={desc || "Property Image"}
        fill
        quality={100}
        priority
        loading="eager" // 'lazy' is ignored when 'priority' is true
        placeholder="blur"
        blurDataURL={CLOUDINARY_URL} // okay for now; see note below
        className="rounded-t-xl object-cover"
        draggable={false}
        unoptimized={true} // okay if you're manually optimizing via Cloudinary transformations
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />


        {unitsAvailable && (
          <div className="absolute top-2 left-2 bg-blue-600/75 text-white text-xs px-2 py-1 rounded-xl">
            {unitsAvailable} unit{unitsAvailable > 1 ? 's' : ''} available
          </div>
        )}
        {verified && (
          <div className="absolute top-2 right-2 bg-white text-blue-600 p-1 rounded-full shadow">
            ✓
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          ₦{price ? price.toLocaleString() : 'N/A'} / yr</h3>
        <p className="text-sm text-gray-600">{desc || 'No description provided'}</p>
        <p className="text-sm font-medium text-blue-700 mt-1">{location || 'Unknown location'}</p>
        <p className="text-sm text-gray-500">For {category || 'Unspecified'}</p>

        <div className="ratings mt-1">
          <StarRating rating={rating || 0} />
        </div>
        <div className="flex gap-2 mt-2">
          <span className="text-sm bg-blue-900 text-white px-2 py-1 rounded">{numberOfBed ?? 0} Bdr</span>
          <span className="text-sm bg-blue-900 text-white px-2 py-1 rounded">{propertyType || 'N/A'}</span>
          <span className="text-sm bg-blue-900 text-white px-2 py-1 rounded">{numberOfBath ?? 0} Bath</span>
        </div>
      </div>
    </div>
  );
}
