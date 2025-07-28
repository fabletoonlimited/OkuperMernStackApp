"use client"
import { useState } from 'react'
import Banner from '../components/bannerIndex'
import StorySection from '../components/storySection'
import TrendingRentIndexCarousel from '../components/trendingRentIndexCarousel/index'
import propertyData from '../data/property.js'
import '../style/globals.css'
import { FaChevronCircleLeft } from 'react-icons/fa';
import { FaChevronCircleRight } from 'react-icons/fa';
import HomesCategory from '../components/homesCategory/index'
import XStories from '../components/xStories/index'

function Homepage() {
  //Chevron cntls
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);


    // Filter out real property cards
  const propertyItems = propertyData.filter(
    (item) =>
      item.Img && Array.isArray(item.Img) && item.Img.length > 0 && item._id
  );

  // Insert an ad banner after every 6 or 7 property cards
  const mixedItems = [];
  let counter = 0;

  // Loop through the properties and insert an ad banner at regular intervals
  for (let i = 0; i < propertyItems.length; i++) {
    mixedItems.push(propertyItems[i]);
    counter++;

    // After every 6th or 7th property card, add an ad banner (use _id "06" as an example)
    if (counter === 6) {
      mixedItems.push({
        _id: "ad-banner", // Unique ID for the ad
        isAd: true, // Mark this as an ad banner
        topic: "Ad Banner",
        desc: "This is an Ad",
        btn: "url", // Example button link
      });
      counter = 0; // Reset counter after the ad
    }
  }

return (
    <>
      <Banner />
      <StorySection />
        <div className='rentCarousel px-10 py-10 mb-10'>
          <h3 className='text-3xl font-medium mb-4 ml-30'>Trending Homes</h3>
          <span className='btn ml-300'>
            <button className="cursor-pointer border-none bg-transparent mx-5">
              <FaChevronCircleLeft 
                className="cursor-pointer"
                color= {hoverLeft ? "#003399" : "e4e5e9"}
                size={45}
                onMouseEnter={() => setHoverLeft(true)}
                onMouseLeave={() => setHoverLeft(false)}
              />
            </button>
            <button className="cursor-pointer border-none bg-transparent">
              <FaChevronCircleRight 
                className="cursor-pointer"
                color= {hoverRight ? "#003399" : "e4e5e9"}
                size={45}
                onMouseEnter={() => setHoverRight(true)}
                onMouseLeave={() => setHoverRight(false)}
            />
            </button>
          </span>
            <TrendingRentIndexCarousel rent={mixedItems} />
        </div>
        <div className='ExploreSegment'>
          <h3 className='text-4xl font-medium mb-4 ml-23 md:ml-40'>Explore homes</h3>
            <div>
              <HomesCategory />
            </div>
        </div>

        <div>
          <XStories />
        </div>
      
      <div className='shortLetCarousel px-10 py-10 mb-10'>
          <h3 className='text-3xl font-medium mb-4 ml-30'>Shortlets Nearby</h3>
          <span className='btn ml-300'>
            <button className="cursor-pointer border-none bg-transparent mx-5">
              <FaChevronCircleLeft 
                className="cursor-pointer"
                color= {hoverLeft ? "#003399" : "e4e5e9"}
                size={45}
                onMouseEnter={() => setHoverLeft(true)}
                onMouseLeave={() => setHoverLeft(false)}
              />
            </button>
            <button className="cursor-pointer border-none bg-transparent">
              <FaChevronCircleRight 
                className="cursor-pointer"
                color= {hoverRight ? "#003399" : "e4e5e9"}
                size={45}
                onMouseEnter={() => setHoverRight(true)}
                onMouseLeave={() => setHoverRight(false)}
            />
            </button>
          </span>
            <TrendingRentIndexCarousel rent={mixedItems} />
        </div>
    </>
  )
}
export default Homepage