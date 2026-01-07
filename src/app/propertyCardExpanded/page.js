"use client";
import React, { useState } from "react";
import PropExpandedNav from "../../components/propExpandedNav";
const Index = () => {
    return (
        <div>
            <PropExpandedNav />

            <div className="property-card-expanded px-4 md:px-12">
                {/* IMAGE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 mt-14">
                    <div className="md:col-span-2 md:row-span-2 w-full aspect-[5/3] overflow-hidden rounded-lg">
                        <img
                            src="/property-image.jpg"
                            alt="property"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {[1, 2, 3, 4].map((_, i) => (
                        <div
                            key={i}
                            className="w-full aspect-[5/3] overflow-hidden rounded-lg">
                            <img
                                src="/property-image.jpg"
                                alt="property"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* PROPERTY DETAILS */}
                <div className="flex flex-col md:flex-row justify-between mt-6 gap-6">
                    <div className="w-full md:flex-1 p-4 rounded-lg">
                        <h2 className="font-bold text-3xl md:text-5xl mb-1">
                            4 Bedroom Flat with BQ
                        </h2>
                        <h4 className="text-blue-950 text-lg md:text-2xl mb-2">
                            Adelabu, Surulere, Lagos
                        </h4>
                        <span className="text-3xl md:text-5xl font-bold">
                            ₦5,500,000
                        </span>
                        <p className="text-black text-sm md:text-lg mt-1">
                            Price is base rent and doesn't require fees
                        </p>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <button className="px-3 py-1 bg-gray-100 text-sm md:text-xl border-2 border-black rounded-md">
                                Bungalow building
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-sm md:text-xl border-2 border-black rounded-md">
                                3 Bed | 2 Toilet
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center border-2 border-black p-6 rounded-lg w-full md:w-96">
                        <button className="bg-blue-950 text-white px-6 py-3 rounded-md text-lg md:text-xl font-semibold w-full">
                            Request to apply
                        </button>

                        <div className="flex flex-col items-center mt-4 gap-3">
                            <h5 className="text-xl md:text-2xl">Rate</h5>
                            <img
                                src="/property-image.jpg"
                                alt="rate"
                                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* LISTED BY / AD CARD */}
                <div className="mt-10 flex flex-col md:flex-row justify-between items-start gap-6">
                    {/* Listed by */}
                    <div className="w-full md:flex-1">
                        <h2 className="text-2xl md:text-3xl font-medium mb-3">
                            Listed by
                        </h2>
                        <div className="flex items-center gap-4">
                            <img
                                src="/profile-placeholder.png"
                                alt="agent"
                                className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="text-lg md:text-2xl">
                                    Username
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm md:text-base">
                                        Verified
                                    </span>
                                    <img
                                        src="/verified-icon.png"
                                        alt="verified"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <hr className="mt-4 md:mt-6" />
                    </div>

                    {/* Ad Card */}
                    <div className="w-full md:w-96 bg-gradient-to-br from-blue-800 to-blue-700 text-white p-6 md:p-8 rounded-xl text-center">
                        <h4 className="text-2xl md:text-4xl font-bold">
                            WorkmanHQ!
                        </h4>
                        <p className="mt-2 md:mt-3 font-light text-sm md:text-base">
                            Don't let pests control you.
                            <br />
                            Contact us for more details
                        </p>
                        <button className="mt-2 md:mt-4 bg-white text-blue-800 px-4 md:px-5 py-2 md:py-3 rounded-md font-semibold text-sm md:text-lg">
                            Get Started
                        </button>
                    </div>
                </div>

                {/* FEATURES */}
                <div className="mt-12">
                    <h2 className="text-4xl md:text-6xl font-semibold mb-6 text-center md:text-left">
                        Features
                    </h2>

                    {["Building amenities", "Unit features"].map((title, i) => (
                        <div key={i} className="mt-8">
                            <h3 className="text-2xl md:text-3xl text-blue-950 mb-4">
                                {title}
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <li
                                        key={j}
                                        className="flex items-center gap-3 bg-gray-100 p-3">
                                        <span className="text-2xl">●</span>
                                        <span className="text-sm md:text-lg">
                                            {title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <hr className="mt-4 md:mt-6" />
                        </div>
                    ))}
                </div>

                {/* MAP */}
                <div className="mt-10 w-full max-w-full md:max-w-5xl mx-auto h-[300px] md:h-[400px] rounded-xl overflow-hidden border shadow-sm">
                    <iframe
                        title="Property location map"
                        src="https://www.google.com/maps?q=Adelabu%20Surulere%20Lagos&output=embed"
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                {/* REQUEST TO APPLY FORM */}
                <div className="mt-10 flex flex-col md:flex-row gap-6">
                    <form className="flex-1 p-4 md:p-6 rounded-lg border md:border-0">
                        <h3 className="text-2xl md:text-3xl font-semibold mb-4">
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
                            type="submit"
                            className="mt-4 bg-blue-900 text-white px-6 py-2 font-semibold w-full md:w-auto">
                            Send request to apply
                        </button>
                    </form>

                    {/* SIDE CARD */}
                    <div className="w-full md:w-80 bg-gradient-to-br from-blue-800 to-blue-700 text-white p-6 rounded-xl shadow-md flex flex-col items-center justify-between">
                        <button className="border-2 border-white px-6 py-3 rounded-2xl font-semibold text-xl mt-6 w-full">
                            Get Started
                        </button>

                        <div className="text-center mt-6 md:mt-8">
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
                <div className="flex flex-col items-center justify-center mt-14 bg-blue-950 p-6 md:p-8 max-w-full md:max-w-6xl mx-4 md:mx-auto">
                    <p className="text-2xl md:text-3xl text-white text-center">
                        Tenancy law
                    </p>
                    <button className="p-3 md:p-4 border-1 rounded-2xl mt-4 text-white text-sm md:text-lg">
                        Read More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Index;
