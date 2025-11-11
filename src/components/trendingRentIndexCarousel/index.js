import React from "react";
import PropertyCard from "../propertyCard/index";
import AdBanner from "../listingAdCard/index";


const TrendingRentIndexCarousel = ({ rent = [] }) => {
  const slicedItems = rent.slice(0, 9).map((item) => ({
    ...item,
    isAd: item.isAd || false,
  }));

  if (slicedItems.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4 space-x-6 px-30 pb-15 flex-shrink-0"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
      {slicedItems.map((item, index) =>
        item.isAd ? (
          <AdBanner
            key={item._id || `ad-${index}`}
            desc={item.desc}
            topic={item.topic}
            btn={item.btn}
            className="w-full md:w-1/3 flex-shrink-0"
            />
        ) : (
          <PropertyCard key={item._id} {...item} />
        )
      )}
    </div>
  );
};

export default TrendingRentIndexCarousel;
