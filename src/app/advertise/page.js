

function Advertise () {
    return (
        <>
            <div className="flex flex-col md:flex-row">
                {/*LEFT SECTION*/}
                <div className="mt-8 ">
                    <div className="space-y-5 p-8 md:mr-20">
                        <h1 className="text-5xl md:text-center  text-start font-bold">
                            Advertise your brand
                        </h1>
                        <h4 className="text-xl font-medium text-wrap md:text-center  text-justify md:px-15">
                            Please send your desired AD request to
                            adverts@okuper.com We will respond by sending you
                            the price list,advert duration and dimensions to
                            send to us by email for upload.
                        </h4>
                    </div>
                    <div className="space-y-5 m-5 md:ml-32 ">
                        <h3 className="font-medium text-3xl ml-5 md:text-4xl  md:mr-8  text-[rgba(14,29,72,1)] ">
                            Sample of in-List AD banner.
                        </h3>

                        <div
                            className="md:w-[350px] md:h-[259px]  ml-6">
                            <div className=" space-y-3  p-18 h-auto  text-center  rounded-lg bg-blue-900 mb-9 md:inline-block text-white">
                                <h4 className="font-semibold md:text-2xl text-2xl pt-5">
                                    Product / Brand Name!
                                </h4>
                                <p className="md:text-lg md:w-[308px] text-2xl text-center  md:font-medium md:h-[108px]">
                                    Text and punchline you want to communicate
                                    to your customers, brand colour/image for
                                    your brand.
                                </p>
                                <p className="text-center border border-white md:text-2xl   text-2xl rounded-xl p-3 inline-block cursor-pointer">
                                    Your Link....
                                </p>
                            </div>
                        </div>
                    </div>

                    <h4
                        className= "font-semibold  text-2xl relative left-29 md:left-[228px] md:mt-42">
                        Dimension: 350px by 259px
                    </h4>

                    <div>
                        <div
                            className="space-y-5 mt-12 md:ml-32 mb-9">
                            <h3 className="font-medium md:text-4xl text-3xl md:mr-10 ml-8 text-[rgba(14,29,72,1)] ">
                                Sample of side AD Banner.
                            </h3>

                            <div
                                className= "md:w-[350px] m-5 md:h-[870px] md:top-[942px]">
                                <div className=" space-y-3 text-center p-14 pt-44  rounded-lg bg-blue-900 min-h-[900px]  text-white inline-block">
                                    <p className=" border border-white md:text-2xl text-2xl  rounded-xl p-4 inline-block  cursor-pointer">
                                        Your Link....
                                    </p>
                                    <h4 className="font-semibold text-2xl pt-30">
                                        Product / Brand Name!
                                    </h4>
                                    <p className="text-2xl font-medium md:h-[108px] md:w-[308px]  text-center">
                                        Text and punchline you want to
                                        communicate with your customers,
                                        image/brand colour for your brand.
                                    </p>
                                </div>
                            </div>

                            <h4
                                className="font-semibold md:text-xl text-2xl text-center md:mr-60 leading-relaxed px-16 md:m-10 text-[rgba(14,29,72,1)">
                                Dimension: 350px by 870px <br/>or<br/>  870px by
                                350px
                            </h4>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="text-white relative m-6 md:mt-20 md:h-[900px] md:w-[1100px]">
                    <div className="relative p-10 rounded-t-2xl bg-[rgba(0,51,153,1)] ">
                        <h2 className="font-medium md:text-3xl text-3xl leading-relaxed px-6 md:px-6">
                            Thank you for choosing to advertise your brand on
                            Okuper.
                        </h2>
                    </div>
                    <p className="absolute  md:font-medium leading-[1.5] -mt-5 md:text-[20px] px-14 md:px-18 text-xl md:text-justify pr-6">
                        Showcase your brand to the hundreds of user who interact
                        with our platform daily. Join us as we the real estate
                        industry and give the power back to the people.
                    </p>

                    {/* RIGHT BANNER IMAGES */}
                    <img
                        src="/bannerlady.png"
                        alt="bannerlady"
                        className="absolute md:mt-15 mt-17 md:h-auto h-120"
                    />

                    <img
                        src="/BannerSam.png"
                        alt="Ad Banner Sam"
                        className="rounded-b-2xl"
                    />
                </div>
            </div>
        </>
    );
}
export default Advertise;