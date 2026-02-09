"use client"
import Link from 'next/link'
import React from 'react'

const index = () => {
  return (
      // {cards}
      <div className="md:mt-10 p-2 pr-4 md:px-12 ">
          <div className="landlordDashboardCard grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-4">
              <div
                  className="items-center space-y-2 rounded-lg bg-white md:w-[310px] w-46 md:h-[250px] h-auto p-5 md:p-8 mb-4"
                  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                  <h4 className="font-black md:text-2xl text-xl md:leading-7 mb-3">
                      Your profile
                  </h4>
                  <p className="md:text-justify">
                      Your profile information is 50% complete
                  </p>
                  <Link
                      href="/verification"
                      className="bg-blue-900 rounded-xl md:p-2 p-3  text-white ">
                      <button className="md:p-8 md:m-0 mt-3 text-sm  cursor-pointer">
                          Update Your profile{" "}
                      </button>
                  </Link>
              </div>
              <div
                  className=" md:px-10 space-y-2 rounded-lg bg-white md:w-[310px] md:h-[250px] h-auto p-5 md:p-8 mb-4 w-46"
                  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                  <h4 className="font-black md:text-2xl text-xl leading-7 mb-3">
                      Listings
                  </h4>
                  <p className="text-justify">
                      Add your property listings to showcase it to tenants
                  </p>
                  <Link
                      href="/propertyListing"
                      className="bg-blue-900  md:p-2 p-3 rounded-xl  text-white ">
                      <button className="md:p-8 md:m-0 mt-3 cursor-pointer text-sm">
                          Upload Your property{" "}
                      </button>
                  </Link>
              </div>
              <div
                  className="md:px-10 -space-y-3 rounded-lg bg-white md:w-[310px] md:h-[250px] h-auto w-46 px-5 p-5 md:p-8 mb-4"
                  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                  <h4 className="font-black md:text-2xl text-xl leading-7 mb-3">
                      Address Verification
                  </h4>
                  <p className="md:text-justify">
                      Verify your listing by providing the required
                      documentation
                  </p>
                  <Link
                      href="./"
                      className="bg-blue-900 md:p-2 p-3 rounded-xl  text-white">
                      <button className="md:p-8 md:m-0 mt-10 cursor-pointer text-sm ">
                          Update Your profile{" "}
                      </button>
                  </Link>
              </div>
              <div
                  className="md:px-10 space-y-2 rounded-lg bg-white md:w-[310px] md:h-[250px] h-auto px-5 p-5 md:p-8 mb-4 w-46"
                  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                  <h4 className="font-black md:text-2xl text-xl leading-7 mb-3">
                      Profile Picture
                  </h4>
                  <p className="text-justify">
                      Add a profile picture to help the guests know you better
                  </p>
                  <Link
                      href="./"
                      className="bg-blue-900  md:p-2 p-3 rounded-xl  text-white ">
                      <button className="md:p-8 md:m-0  cursor-pointer mt-8 text-sm">
                          Update Your profile{" "}
                      </button>
                  </Link>
              </div>
              <div
                  className="md:px-10 space-y-2  rounded-lg bg-white md:w-[310px] md:h-[250px] h-auto px-5 p-5 md:p-8 mb-4 w-46"
                  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                  <h4 className="font-black md:text-2xl text-xl leading-7 mb-3">
                      Property Preference
                  </h4>
                  <p className="text-justify">
                      These preferences will help us match better with homes
                  </p>
                  <Link
                      href="./"
                      className="bg-blue-900  md:p-2 p-3 rounded-xl  text-white ">
                      <button className="md:p-8 md:m-0 mt-8 cursor-pointer text-sm">
                          Update Your profile{" "}
                      </button>
                  </Link>
              </div>
              <div
                  className=" md:px-10 rounded-lg bg-white md:w-[310px] md:h-[250px] h-auto px-5 p-5 mmd:p-8 mb-4 w-46"
                  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                  <h4 className="font-black md:text-2xl text-xl leading-7 mb-3">
                      Account Details
                  </h4>
                  <p className="md:w-60 mt-2 md:text-justify">
                      Add your account details to enable us forward your tenants
                      payments after finalizing home
                  </p>
                  <Link
                      href="./"
                      className="bg-blue-900 md:p-2 p-3 rounded-xl  text-white ">
                      <button className="md:p-8 md:m-0 mt-4 cursor-pointer text-sm">
                          Update Your profile{" "}
                      </button>
                  </Link>
              </div>
          </div>
      </div>
  );
}

export default index
