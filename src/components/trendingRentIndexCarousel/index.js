import PropertyCard from "../propertyCard/index";
import AdBanner from "../listingAdCard/index";

const TrendingRentIndexCarousel= ({ rent }) => {
    //Slice first 9 items from mixed array
    const slicedItems = rent.slice(0, 7);
    return (
        <div  className="flex flex-row overflow-x-auto space-x-6 px-10 pb-10 scrollbar-hide"
        style={{ scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none',}} // IE & Edge
          >
        { slicedItems.map((item, index) =>
          item.isAd ? (
            <AdBanner key={`ad-${index}`} desc={item.desc} topic={item.topic} btn={item.btn} />
          ) : (
            <PropertyCard key={item._id} {...item} />
          )
        )}    
        </div>
      );
    };

export default TrendingRentIndexCarousel;
