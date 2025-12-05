"use client"
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar/index.js";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter/index.js";
import React from 'react'
import UploadSection from "../../components/uploadSection/index.js";

const page = () => {
  return (
      <div>
          <LandlordDashboardSidebar />
          {/* Top Nav Section*/}
          <div className="landlordDashboardlist mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
              <h1 className="font-bold md:text-5xl text-2xl pl-7">
                  Dear, Landlord!
              </h1>
              <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify font-medium">
                  We are thrilled that you have chosen to list your property
                  with Okuper.
              </p>
          </div>
          {/* Dashboard Section*/}
          <div className="landlordDashboardproperty mt-8 md:ml-6 md:px-0 px-4">
              <h3 className="font-semibold md:text-4xl text-2xl pl-7 leading-[150%]">
                  Property Listing
              </h3>
              <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify font-medium">
                  Please use the form below to upload two FREE your property.
              </p>
          </div>
          <UploadSection />
          <LandlordDashboardFooter />
      </div>
  );
}

export default page