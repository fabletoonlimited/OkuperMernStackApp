"use client";
import React, { useState, useRef } from "react";
import PropExpandedNav from "../../components/propExpandedNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import propertyData from "../../data/property";
import TrendingRentIndexCarousel from "../../components/trendingRentIndexCarousel";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import Footer from "../../components/footer";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import StarRating from "@/components/starRating/starRating";

const Index = () => {
    const [hoverLeft, setHoverLeft] = useState(false);
    const [hoverRight, setHoverRight] = useState(false);

    // Separate refs for each carousel
    const trendingRef = useRef(null);

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
        (item) =>
            item.img &&
            Array.isArray(item.img) &&
            item.img.length > 0 &&
            item._id
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

    const [selectedImage, setSelectedImage] = useState(null);

    // Image URLs (replace with your actual images)
    const images = [
        "/property-image.jpg",
        "/property-image.jpg",
        "/property-image.jpg",
        "/property-image.jpg",
        "/property-image.jpg",
    ];

    return (
        <div className="w-auto">
            <PropExpandedNav />

            <div className="property-card-expanded px-4 md:px-12">
                {/* IMAGE GRID */}
                {/* IMAGE GRID */}
                <div className="mt-14">
                    {/* MAIN IMAGE (MOBILE) */}
                    <div className="relative w-full aspect-[5/3] overflow-hidden rounded-lg cursor-pointer md:hidden border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <img
                            src={images[0]}
                            alt="property"
                            className="w-full h-full object-cover"
                            onClick={() => setSelectedImage(images[0])}
                        />

                        {/* Overlay Icon */}
                        <div className="absolute top-2 left-2 z-10">
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="text-3xl text-blue-300/95 rounded-full p-1"
                            />
                        </div>
                    </div>

                    {/* MOBILE THUMBNAILS */}
                    <div className="grid grid-cols-4 gap-2 mt-3 md:hidden">
                        {images.slice(1, 5).map((img, i) => (
                            <div
                                key={i}
                                className="aspect-[5/3] overflow-hidden rounded-md cursor-pointer border-2 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <img
                                    src={img}
                                    alt="property"
                                    className="w-full h-full object-cover"
                                    onClick={() => setSelectedImage(img)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP GRID */}
                    <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-6">
                        {/* Main Image */}
                        <div className="relative col-span-2 row-span-2 aspect-[5/3] overflow-hidden rounded-lg cursor-pointer border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <img
                                src={images[0]}
                                alt="property"
                                className="w-full h-full object-cover"
                                onClick={() => setSelectedImage(images[0])}
                            />

                            <div className="absolute top-2 left-2 z-10">
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-3xl text-blue-300/95 rounded-full p-1"
                                />
                            </div>
                        </div>

                        {/* Other Images */}
                        {images.slice(1).map((img, i) => (
                            <div
                                key={i}
                                className="aspect-[5/3] overflow-hidden rounded-lg cursor-pointer border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <img
                                    src={img}
                                    alt="property"
                                    className="w-full h-full object-cover"
                                    onClick={() => setSelectedImage(img)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* PROPERTY DETAILS */}
                <div className="flex flex-col md:flex-row justify-between mt-4 gap-6 items-center ">
                    <div className="w-full md:flex-1 p-4 rounded-lg ml-2 md:ml-0">
                        <h2 className="font-bold text-2xl md:text-4xl mb-1">
                            4 Bedroom Flat with BQ
                        </h2>
                        <h4 className="text-blue-950 text-2xl md:text-2xl md:mb-2 mb-5">
                            Adelabu, Surulere, Lagos.
                        </h4>
                        <span className="text-5xl md:text-5xl md:font-bold font-black">
                            ₦5,500,000
                        </span>
                        <p className="text-lg md:mt-1 mt-2 text-blue-900">
                            Price is base rent and doesn't require fees.
                        </p>

                        <div className="flex flex-wrap md:gap-2 gap-6 md:mt-4 mt-7">
                            <div className="md:px-10 md:py-1 bg-gray-100 text-2xl md:text-2xl border-1 px-16 py-4 border-blue-950">
                                Bungalow building
                            </div>
                            <div className="md:px-16 md:py-1 bg-gray-100 text-2xl md:text-2xl border-1 px-20.5 py-4 border-blue-950">
                                3 Bed | 2 Toilet
                            </div>
                        </div>
                    </div>

                    <div className="md:flex flex-col md:items-center border-1 border-blue-950 md:border-1 md:p-6 rounded-lg w-full md:w-96 p-11 h-70 mt-14">
                        <div className="items-start md:items-start">
                            <button
                                className="bg-blue-950 hover:bg-blue-700 transition duration-300 ease-in-out
                            text-white md:px-20 md:py-3 rounded-sm md:rounded-md text-3xl md:text-xl  
                            md:font-semibold font-medium md:w-full w-full px-6 py-3 ">
                                Request to apply
                            </button>
                        </div>
                        {/*star rating*/}
                        <div className="flex flex-col  mt-4 mb-4 gap-3 w-full">
                            <h5 className="text-3xl md:text-2xl ">Rate</h5>
                            <div className="h-16 ">
                                <StarRating />
                            </div>
                        </div>
                    </div>
                </div>

                {/* LISTED BY / AD CARD */}
                <div className="mt-14 flex md:flex-row md:justify-between justify-around items-start gap-6">
                    {/* Listed by */}
                    <div className="w-full md:flex-1 md:ml-3">
                        <h2 className="text-4xl md:text-3xl font-medium mb-3">
                            Listed by
                        </h2>
                        <div className="flex items-center gap-4">
                            <FontAwesomeIcon
                                icon={faCircleUser}
                                style={{ fontSize: "46px",background:"gray"  }}
                            />

                            <div>
                                <h3 className="text-2xl md:text-2xl">
                                    Username
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-700 md:text-base">
                                        Verified
                                    </span>
                                    <FontAwesomeIcon
                                        icon={faCircleInfo}
                                        style={{
                                            fontSize: "10px",
                                            color: "darkgreen",
                                        }}
                                    />
                                </div>
                            </div>
                            <hr className="mt-4 md:mt-6 text-gray-300" />
                        </div>
                    </div>

                    {/* Ad Card */}
                    <div className="w-full md:w-96 bg-gradient-to-br from-blue-800 to-blue-700 text-white p-6 md:p-8 text-center rounded-md">
                        <h4 className="text-2xl md:text-4xl font-bold">
                            WorkmanHQ!
                        </h4>
                        <p className="mt-2 md:mt-3 font-light text-sm md:text-base">
                            Don't let pests control you.
                            <br />
                            Contact us for more details
                        </p>
                        <button className="mt-2 md:mt-4 bg-white text-blue-800 hover:bg-blue-800 hover:text-neutral-50 transition duration-300 ease-in-out px-4 md:px-5 py-2 md:py-3 rounded-md font-semibold text-sm md:text-lg">
                            {" "}
                            Get Started
                        </button>
                    </div>
                </div>
                {/* FEATURES */}
                <div className="mt-12">
                    <h2 className="text-5xl md:text-6xl font-medium md:font-semibold mb-6 md:text-start text-start ">
                        Features
                    </h2>

                    {["Building amenities", "Unit features"].map((title, i) => (
                        <div key={i} className="mt-9">
                            <h3 className="text-3xl md:text-3xl text-blue-950 mb-4 border-1 p-2">
                                {title}
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <li
                                        key={j}
                                        className="flex items-center gap-3 bg-gray-100 p-3">
                                        <span className="md:text-2xl text-2xl">
                                            ●
                                        </span>
                                        <span className="text-2xl md:text-lg">
                                            {title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <h3 className="text-3xl md:text-3xl text-blue-950 mb-4 p-2 mt-9">
                    Neighborhood: Postcode
                </h3>
                {/* MAP */}
                <div className="mt-8 w-full max-w-full md:max-w-5xl mx-auto h-[300px] md:h-[400px] rounded-sm overflow-hidden border shadow-sm">
                    <iframe
                        title="Property location map"
                        src="https://www.google.com/maps?q=Adelabu%20Surulere%20Lagos&output=embed"
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                {["Nearby Places"].map((title, i) => (
                    <div key={i} className="mt-9">
                        <h3 className="text-3xl md:text-3xl text-blue-950 mb-4 p-2">
                            {title}
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {Array.from({ length: 4 }).map((_, j) => (
                                <li
                                    key={j}
                                    className="flex items-center gap-3 bg-gray-100 p-3">
                                    <span className="md:text-2xl text-2xl">
                                        ●
                                    </span>
                                    <span className="text-2xl md:text-lg">
                                        {title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <hr className="mt-4 md:mt-6 text-gray-300" />
                    </div>
                ))}
                {/* REQUEST TO APPLY FORM */}
                <div className="mt-10 flex flex-col md:flex-row gap-6">
                    <form className="flex-1 p-4 md:p-6 rounded-lg md:border-0">
                        <h3 className="text-3xl md:text-3xl md:font-medium font-medium mb-4">
                            Request to apply
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-lg mb-1">
                                    First name
                                </label>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    className="w-full border px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-lg mb-1">
                                    Last name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    className="w-full border px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-lg mb-1">Phone</label>
                            <input
                                type="tel"
                                placeholder="Phone number"
                                className="w-full border px-3 py-2"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-lg mb-1">
                                Message
                            </label>
                            <textarea
                                rows="4"
                                placeholder="Write your message"
                                className="w-full border px-3 py-2"
                            />
                        </div>

                        <button
                            className="mt-4 w-full md:w-full px-6 py-3 text-2xl font-medium text-white bg-blue-950 rounded-lg shadow-md 
                   hover:bg-blue-700 transition duration-300 ease-in-out">
                            Send request to apply
                        </button>

                        <div className="mb-8 mt-8 font-medium text-3xl">
                            <p className="text-black ">will be sent to</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FontAwesomeIcon
                                icon={faCircleUser}
                                style={{ fontSize: "46px" }}
                            />
                            <div>
                                <h3 className="text-2xl md:text-2xl">
                                    Username
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-700">
                                        Verified
                                    </span>
                                    <FontAwesomeIcon
                                        icon={faCircleInfo}
                                        style={{
                                            fontSize: "10px",
                                            color: "lightgreen",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* SIDE CARD */}
                    <div className="w-full md:w-80 bg-blue-800 text-white p-6 rounded-xl shadow-md flex flex-col items-center justify-around">
                        <button
                            className="border-2 border-white px-6 hover:bg-blue-800 hover:scale-95 transition duration-300 ease-in-out
                            py-3 rounded-2xl font-semibold text-xl mt-20 w-full">
                            Get Started
                        </button>

                        <div className="text-center mt-24 md:mt-2 ">
                            <h4 className="text-2xl font-bold">WorkmanHQ!</h4>
                            <p className="mb-46 font-light leading-snug text-2xl md:text-base">
                                Don't let pests control you.
                                <br />
                                Contact us for more details
                            </p>
                        </div>
                    </div>
                </div>
                {/* TENANCY LAW FOOTER */}
                <div className="flex flex-col items-center justify-center mt-14 bg-blue-950 p-6 md:p-4 max-w-full md:max-w-6xl mx-4 md:mx-auto">
                    <p className="text-2xl md:text-4xl text-white text-center mt-5">
                        Tenancy law
                    </p>
                    <button
                        className="px-4 py-3 border-1 rounded-md mt-9 hover:bg-blue-900 hover:scale-95 transition duration-300 ease-in-out
                        text-white text-sm md:text-lg">
                        {" "}
                        Read More
                    </button>
                </div>
                {/* Trending Section */}
                <section className="max-w-7xl mx-auto px-4 md:px-10 py-6 mt-7">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-3xl font-bold md:font-medium">
                            Nearby Apartments
                        </h3>

                        {/* Desktop arrows only */}
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

                    {/* Carousel */}
                    <div
                        ref={trendingRef}
                        className="
      grid
      place-items-center
      md:block
      overflow-hidden
      md:overflow-x-auto
      scroll-smooth
      scrollbar-hide
    ">
                        <div className="flex gap-4 md:flex-nowrap">
                            <TrendingRentIndexCarousel rent={mixedItems} />
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default Index;
 