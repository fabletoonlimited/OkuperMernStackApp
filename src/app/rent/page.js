 'use client';
import React, { useEffect, useState } from 'react';
import AdBannerCard from '../../components/listingAdCard/index';
import PropertyCard from '../../components/propertyCard/index';
import FilterNavbarIndex from '../../components/filterNavbarHome/index';
import '../../style/globals.css';
import { categories } from '@/data/constants';

function Rent() {
  const [propertyItems, setPropertyItems] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties'); // or your endpoint
        const data = await response.json();

        const filtered = data.filter(
          (item) => item.Img && Array.isArray(item.Img) && item.Img.length > 0 && item._id
        );

        // Insert ad banners after every 6 property cards
        const mixedItems = [];
        let counter = 0;

        for (let i = 0; i < filtered.length; i++) {
          mixedItems.push(filtered[i]);
          counter++;

          if (counter === 6) {
            mixedItems.push({
              _id: 'ad-banner-' + i,
              isAd: true,
              topic: 'Ad Banner',
              desc: 'This is an Ad',
              btn: '/ad-link',
            });
            counter = 0;
          }
        }

        setPropertyItems(mixedItems);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
      <FilterNavbarIndex />
      <main className="bg-gray-100 min-h-screen py-3 px-6 md:px-12">
        <h1 className="text-3xl font-bold text-blue-800 mb-2 text-start">
          Rental Listing
        </h1>
          <p className="text-md text-blue-800 mb-10 text-start">
            {propertyItems.filter((item) => !item.isAd).length} homes available
          </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyItems.map((item) =>
            item.isAd ? (
              <AdBannerCard key={item._id} {...item} />
            ) : (
              <PropertyCard key={item._id} {...item} />
            )
          )}
        </div>
      </main>
    </>
  );
}

export default Rent;
