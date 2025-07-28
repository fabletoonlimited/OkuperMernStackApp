import React from 'react';
import Image from 'next/image';

const Index = () => {
  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-6 px-4 md:px-40 py-8 mb-10">
  {/* Buy */}
  <div className="bg-white p-8 rounded-lg shadow-lg h-full max-w-80 min-h-96 w-72 md:w-1/3 text-center mb-8 md:mb-0">
    <Image 
      height={190}
      width={190}
      src="/Buy_a_House.png"
      alt="Buy a home"
      className="mx-auto mb-4 mt-5"
    />
    <h3 className="text-3xl font-bold text-blue-800 mb-1">Buy a home</h3>
    <h5 className="text-gray-800 text-sm mb-6">
      Find your place with a photo experience and the most listings, including things you won’t find anywhere else.
    </h5>
    <button className="font-bold rounded-lg mb-8 w-full text-lg py-2 bg-blue-950 text-white hover:bg-blue-900 transition">
      Browse Homes
    </button>
  </div>

  {/* Rent */}
  <div className="bg-white p-8 rounded-lg shadow-lg h-full max-w-80 min-h-96 w-72 md:w-1/3 text-center mb-8 md:mb-0">
    <Image 
      height={170}
      width={170}
      src="/Rent_a_House.png"
      alt="Rent a home"
      className="mx-auto mb-4 mt-6"
    />
    <h3 className="text-3xl font-bold text-blue-800 mb-1">Rent a home</h3>
    <h5 className="text-gray-800 text-sm mb-6">
      Find rentals with ease — from verified listings to short lets, everything is curated to suit your lifestyle.
    </h5>
    <button className="font-bold rounded-lg mb-8 w-full text-lg py-2 bg-blue-950 text-white hover:bg-blue-900 transition">
      Browse Rentals
    </button>
  </div>

  {/* Short Let */}
  <div className="bg-white p-8 rounded-lg shadow-lg h-full max-w-80 min-h-96 w-72 md:w-1/3 text-center">
    <Image 
      height={200}
      width={200}
      src="/Short_Let.png"
      alt="Shortlet"
      className="mx-auto"
    />
    <h3 className="text-3xl font-bold text-blue-800 mb-2">Short Let</h3>
    <h5 className="text-gray-800 text-sm mb-6">
      Discover short-term stays with comfort, style, and convenience. Ideal for travel, remote work, or quick city visits.
    </h5>
    <button className="font-bold rounded-lg mb-8 w-full text-lg py-2 bg-blue-950 text-white hover:bg-blue-900 transition">
      Explore Shortlets
    </button>
  </div>
</div>

  );
};

export default Index;
