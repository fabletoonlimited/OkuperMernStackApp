'use client';
import React from 'react';
import styles from './Advertise.module.scss';

function Advertise() {
  return (
    <div className={`flex flex-col md:flex-row ${styles.container}`}>
      
      {/* LEFT SECTION */}
      <section className={`mt-8 ${styles.left}`}>
        <div className={`space-y-5 p-8 md:mr-20 ${styles.title}`}>
          <h1 className="text-5xl font-bold text-start md:text-center">
            Advertise your brand
          </h1>
          <h4 className="text-xl font-medium text-justify md:text-center">
            Please send your desired ad request to <strong>adverts@okuper.com</strong>. 
            We’ll respond with our price list, ad duration, and dimensions 
            to send your creatives for upload.
          </h4>
        </div>

        {/* In-List Ad Sample */}
        <div className={`space-y-5 m-5 md:ml-32 ${styles.sample}`}>
          <h3 className="font-medium text-2xl ml-5 md:text-4xl text-[rgba(14,29,72,1)]">
            Sample of in-list ad banner
          </h3>

          <div className={`ml-6 md:w-[350px] md:h-[259px] ${styles.form}`}>
            <div className="space-y-3 p-8 text-center rounded-lg bg-blue-900 mb-9 text-white">
              <h4 className="font-semibold md:text-2xl">Product / Brand Name!</h4>
              <p className="md:text-lg md:w-[308px] text-center md:font-medium md:h-[108px]">
                Text and punchline you want to communicate to your customers,
                with your brand color/image.
              </p>
              <p className="border border-white md:text-2xl rounded-xl p-3 inline-block cursor-pointer">
                Your Link...
              </p>
            </div>
          </div>
        </div>

        <h4
          className={`font-semibold text-xl relative left-[25px] md:left-[204px] md:mt-10 ${styles.dim}`}
        >
          Dimension: 350px × 259px
        </h4>

        {/* Side Ad Sample */}
        <div className={`space-y-5 mt-12 md:ml-32 mb-9 ${styles.banner}`}>
          <h3 className="font-medium text-2xl md:text-4xl ml-8 text-[rgba(14,29,72,1)]">
            Sample of side ad banner
          </h3>

          <div className={`md:w-[350px] m-5 md:h-[870px] ${styles.brand}`}>
            <div className="space-y-3 text-center p-14 pt-44 rounded-lg bg-blue-900 min-h-[870px] text-white inline-block">
              <p className="border border-white md:text-2xl rounded-xl p-4 inline-block cursor-pointer">
                Your Link...
              </p>
              <h4 className="font-semibold text-2xl pt-8">Product / Brand Name!</h4>
              <p className="text-lg font-medium md:h-[108px] md:w-[308px]">
                Text and punchline you want to communicate with your customers,
                image/brand color for your brand.
              </p>
            </div>
          </div>

          <h4 className="font-semibold text-xl text-center md:mr-60 leading-relaxed px-16 md:m-10 text-[rgba(14,29,72,1)]">
            Dimension: 350px × 870px <br />or<br /> 870px × 350px
          </h4>
        </div>
      </section>

      {/* RIGHT SECTION */}
      <section
        className={`text-white m-6 md:mt-20 md:h-[900px] md:w-[1100px] ${styles.advertiseThankubanner}`}
      >
        <div className={`relative p-10 rounded-t-2xl bg-[rgba(0,51,153,1)] ${styles.case}`}>
          <h2 className="font-medium md:text-3xl leading-relaxed px-6">
            Thank you for choosing to advertise your brand on Okuper.
          </h2>
        </div>

        <p className="absolute md:font-medium leading-[1.5] -mt-5 md:text-[20px] px-12 text-xl md:text-justify">
          Showcase your brand to hundreds of users interacting with our platform daily.
          Join us as we redefine the real estate industry and give the power back to the people.
        </p>

        {/* Right-side images */}
        <img
          src="/bannerlady.png"
          alt="Illustration of a woman for advertisement sample"
          className={`absolute md:mt-16 h-[460px] md:h-auto ${styles.bannerlady}`}
        />

        <img
          src="/BannerSam.png"
          alt="Okuper ad banner sample"
          className={`rounded-b-2xl ${styles.bannersam}`}
        />
      </section>
    </div>
  );
}

export default Advertise;
