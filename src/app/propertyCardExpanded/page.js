import React from "react";
import PropExpandedNav from "../../components/propExpandedNav/index.js";

const index = () => {
    return (
        <div>
            <PropExpandedNav />
            <div className="property-card-expanded">
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2">
                    <div className="md:col-span-2 md:row-span-2 w-full h-[56rem] md:h-auto overflow-hidden">
                        <img
                            src="/property-image.jpg"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="w-full h-28 md:h-40 overflow-hidden">
                        <img
                            src="/property-image.jpg"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="w-full h-28 md:h-40 overflow-hidden">
                        <img
                            src="/property-image.jpg"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="w-full h-28 md:h-40 overflow-hidden">
                        <img
                            src="/property-image.jpg"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="w-full h-28 md:h-40 overflow-hidden">
                        <img
                            src="/property-image.jpg"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                < div className="flex justify-around">
                    <div className="mt-6 p-4  rounded-lg  w-full">
                        <h2 className="font-bold text-5xl mb-1">
                            Four Bedroom Flat with BQ
                        </h2>
                        <h4 className="text-gray-600 mb-2 text-2xl">
                            Adelabu, Surulere, Lagos
                        </h4>

                        <div className="">
                            <span className="text-5xl font-extrabold mb-1">
                                ₦5,500,000
                            </span>
                            <h6 className="text-gray-500 mb-2 text-2xl">
                                Price is base rent and doesn't require fees
                            </h6>
                        </div>

                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-gray-100 text-2xl border-black border-2">
                                Bungalow building
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-2xl border-black border-2">
                                3 Bed | 2 Toilet
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button className="bg-blue-950">
                            Request to apply
                        </button>
                        <br />
                        <h5>Rate</h5>
                        <br />
                        <img src="" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default index;
