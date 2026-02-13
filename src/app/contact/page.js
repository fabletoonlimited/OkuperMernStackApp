import React from "react";
import Navbar from "../../components/nav/index";

const Contact = () => {
    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-20">
                <div className="flex flex-col lg:flex-row items-start gap-16">
                    {/* LEFT SECTION */}
                    <div className="w-full lg:w-5/12">
                        <p className="text-blue-950 text-5xl font-bold mb-8">
                            Contact Us
                        </p>

                        <p className="font-medium text-base md:text-md leading-relaxed mb-6">
                            Our designated and trained 24 hour customer support
                            is available and will respond to your complaints in
                            a timely manner.
                        </p>

                        <p className="font-medium text-base md:text-md mb-6">
                            Please send your complaints to contact@okuper.com
                        </p>

                        <p className="font-medium text-base md:text-md">
                            You can also contact us via Whatsapp by using the
                            chat box on the homepage.
                        </p>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="w-full lg:w-7/12 flex justify-center">
                        <div className="rounded-2xl overflow-hidden shadow-xl w-full max-w-2xl">
                            {/* Top Blue Banner */}
                            <div className="bg-[rgba(0,51,153,1)] text-white p-12">
                                <h2 className="text-5xl font-semibold leading-snug mb-8">
                                    Thank you for <br /> contacting Okuper
                                </h2>

                                <p className="text-lg md:text-xl leading-relaxed">
                                    Our designated and trained customer support
                                    is available to treat your complaint in a
                                    timely manner.
                                </p>
                            </div>

                            {/* Banner Image */}
                            <img
                                src="/BannerSam.png"
                                alt="Ad Banner Sam"
                                className="w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
