"use client";
import { useRef, useState } from "react";
import Banner from "../components/bannerIndex";
import StorySection from "../components/storySection";
import TrendingRentIndexCarousel from "../components/trendingRentIndexCarousel";
import ShortletIndexCarousel from "../components/shortletIndexCarousel";
import propertyData from "../data/property";
import HomesCategory from "../components/homesCategory";
import XStories from "../components/xStories";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import "../style/globals.css";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faHandshake,
  faMagnifyingGlass,
  faUser,
  faCircleXmark,
  faCarSide,
} from "@fortawesome/free-solid-svg-icons";

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
    <div className="h-auto bg-gray-100">
      <Banner />
      <StorySection />

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-4 py-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl text-blue-900 font-semibold">Trending Homes</h3>
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
        <div ref={trendingRef} className="md:flex row gap-4 w-screen h-auto bg-gray-400 overflow-x-none md:overflow-x-auto scroll-smooth scrollbar-hide">
          <TrendingRentIndexCarousel rent={mixedItems} />
        </div>
      </section>

      {/*Why Okuper */}
      <div className="md:px-30 px-15 my-20 bg-blue-600 h-auto p-10">
        <p className="text-4xl font-semibold my-6 md:text-center text-left text-white">Why Choose Okuper</p>
        <h3 className="md:text-center text-justify text-2xl mb-5 -mt-3 text-white">A better way to find and rent your next home.</h3>
        <p className="md:text-center text-justify text-white mb-15 md:px-20 px-0">We built Okuper to remove the unecessary barriers between genuine homeowners and people looking for a home. We help verified tenants and homeowners connect directly, making property discovery more transparent, accesible, and trustworthy.</p>

        <div className="md:flex row gap-45 space-y-10">
            <div className="flex">
              <FontAwesomeIcon
                icon={faHome}
                className=" md:text-2xl text:2xl text-white text-md mr-2"
              />
              <div>
                <p className="font-bold text-white mb-2">Verified properties</p>
                <p className="w-60 text-white">
                  Discover properties that have gone through Okuper's secure verification process.
                </p>
              </div>
            </div>

            <div className="flex">
              <FontAwesomeIcon
                icon={faHandshake}
                className=" md:text-2xl text:2xl text-white text-md mr-2"
              />
              <div>
                <p className="font-bold text-white mb-2">Direct Communication</p>
                <p className="w-60 text-white">
                  Connect directly with verified homeowners or prospective tenants via our inbox chats.
                </p>
              </div>
            </div>

            <div className="flex md:mb-0 mb-10">
              <FontAwesomeIcon
                icon={faUser}
                className=" md:text-2xl text:2xl text-white text-md mr-2"
              />
              <div>
                <p className="font-bold text-white mb-2">Choose your preferred tenant</p>
                <p className="w-60 text-white">
                  Homeowners can review verified prospective tenant profiles before connecting or selecting.</p>
              </div>
            </div>
          </div>

          <div className="md:flex row gap-45 space-y-10">
            <div className="flex">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className=" md:text-2xl text:2xl text-white text-md mr-2"
              />
              <div>
                <p className="font-bold text-white mb-2">Avoid Inspection fees scam</p>
                <p className="w-60 text-white">
                  Know more about a property before spending money to inspect it.
                </p>
              </div>
            </div>

            <div className="flex">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className=" md:text-2xl text:2xl text-white text-md mr-2"
              />
              <div>
                <p className="font-bold text-white mb-2">Avoid Agency fees</p>
                <p className="w-60 text-white">
                  Connect directly with landlords or property managers and reduce unecessary middleman costs.
                </p>
              </div>
            </div>

            <div className="flex">
              <FontAwesomeIcon
                icon={faCarSide}
                className=" md:text-2xl text:2xl text-white text-md mr-2"
              />
              <div>
                <p className="font-bold text-white mb-2">Save Time & Transport Costs</p>
                <p className="w-60 text-white">
                  Shortlist properties and wait for homeowners approval that match your needs before visiting.
                </p>
              </div>
            </div>
        </div>
      </div>

      {/* Explore Homes */}
      <section className="max-w-7xl mx-auto px-10 md:px-4 py-10">
        <h3 className="text-4xl font-semibold mb-8">Explore Homes</h3>
        <div className="justify-center">
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
          <ShortletIndexCarousel shortlet={mixedItems}/>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
