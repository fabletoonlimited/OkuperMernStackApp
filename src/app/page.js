"use client";
import { useRef, useState } from "react";
import Banner from "../components/bannerIndex";
import StorySection from "../components/storySection";
import TrendingRentIndexCarousel from "../components/trendingRentIndexCarousel";
import propertyData from "../data/property";
import HomesCategory from "../components/homesCategory";
import XStories from "../components/xStories";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import "../style/globals.css";

function Homepage() {
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);

  // Separate refs for each carousel
  const trendingRef = useRef(null);
  const shortletsRef = useRef(null);

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // Filter property items
  const propertyItems = propertyData.filter(
    (item) => item.img && Array.isArray(item.img) && item.img.length > 0 && item._id
  );

  // Mix ad banners
  const mixedItems = [];
  let counter = 0;
  for (let i = 0; i < propertyItems.length; i++) {
    mixedItems.push(propertyItems[i]);
    counter++;
    if (counter === 6) {
      mixedItems.push({
        _id: "ad-banner",
        isAd: true,
        topic: "Ad Banner",
        desc: "This is an Ad",
        btn: "url",
      });
      counter = 0;
    }
  }

  return (
    <>
      <Banner />
      <StorySection />

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-10 md:px-4 py-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-semibold">Trending Homes</h3>
          <div className="hidden md:flex gap-4">
            <FaChevronCircleLeft
              color={hoverLeft ? "#003399" : "#e4e5e9"}
              size={40}
              className="cursor-pointer"
              onMouseEnter={() => setHoverLeft(true)}
              onMouseLeave={() => setHoverLeft(false)}
              onClick={() => scrollLeft(trendingRef)}
            />
            <FaChevronCircleRight
              color={hoverRight ? "#003399" : "#e4e5e9"}
              size={40}
              className="cursor-pointer"
              onMouseEnter={() => setHoverRight(true)}
              onMouseLeave={() => setHoverRight(false)}
              onClick={() => scrollRight(trendingRef)}
            />
          </div>

        </div>
      {/*Carousel*/}
        <div
          ref={trendingRef}
          className="flex -ml-28 md:-ml-0 gap-4 overflow-x-none md:overflow-x-auto scroll-smooth scrollbar-hide"
        >
          <TrendingRentIndexCarousel rent={mixedItems} />
        </div>
      </section>

      {/* Explore Homes */}
      <section className="max-w-7xl mx-auto px-10 md:px-4 py-10">
        <h3 className="text-4xl font-semibold mb-8">Explore Homes</h3>
        <div className="-ml-28 md:-ml-0">
          <HomesCategory />
        </div>
      </section>

      {/* Stories */}
      <section className="py-12">
        <XStories />
      </section>

      {/* Shortlets */}
      <section className="max-w-7xl mx-auto px-10 md:px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-semibold">Shortlets Nearby</h3>
          <div className="gap-4 hidden md:flex">
            <FaChevronCircleLeft
              color={hoverLeft ? "#003399" : "#e4e5e9"}
              size={40}
              className="cursor-pointer"
              onMouseEnter={() => setHoverLeft(true)}
              onMouseLeave={() => setHoverLeft(false)}
              onClick={() => scrollLeft(shortletsRef)}
            />
            <FaChevronCircleRight
              color={hoverRight ? "#003399" : "#e4e5e9"}
              size={40}
              className="cursor-pointer"
              onMouseEnter={() => setHoverRight(true)}
              onMouseLeave={() => setHoverRight(false)}
              onClick={() => scrollRight(shortletsRef)}
            />
          </div>
        </div>
        <div ref={shortletsRef} className="flex -ml-28 md:-ml-0 gap-4 overflow-x-auto scroll-smooth scrollbar-hide">
          <TrendingRentIndexCarousel rent={mixedItems} />
        </div>
      </section>
    </>
  );
}

export default Homepage;
