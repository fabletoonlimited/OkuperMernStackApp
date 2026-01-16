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
        <div
            className="
        flex
        gap-4
        w-fit
        mx-auto
      "
            style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}>
            {slicedItems.map((item, index) =>
                item.isAd ? (
                    <div
                        key={item._id || `ad-${index}`}
                        className="w-80 flex-shrink-0">
                        <AdBanner
                            desc={item.desc}
                            topic={item.topic}
                            btn={item.btn}
                        />
                    </div>
                ) : (
                    <div key={item._id} className="w-80 flex-shrink-0">
                        <PropertyCard {...item} />
                    </div>
                )
            )}
        </div>
    );
};

export default TrendingRentIndexCarousel;
