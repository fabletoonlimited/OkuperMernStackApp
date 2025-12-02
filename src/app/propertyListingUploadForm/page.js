
"use client";
import React from 'react';
import LandlordDashboardSidebar from '../../components/landlordDashboardSidebar'
import LandlordDashboardFooter from "../../components/landlordDashboardFooter/index.js";
import { CloudUpload } from 'lucide-react';
import RatingStar from '../../components/ratingStar/index.js';
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
          {/* Form Section*/}
          <div className="bg-white md:w-[1300px] md:h-[2190px] h-750 md:m-8 m-4">
              <ul className="font-semibold md:text-2xl md:space-y-10 space-y-8 p-10 md:pt-20 md:ml-18 ">
                  <li className="md:flex">
                      <h5 className="mt-4">Pictures:</h5>
                      <div className="md:flex gap-5 md:ml-8 space-y-4">
                          <div
                              className="flex flex-col items-center justify-center
                                border-2 border-dashed border-gray-400 md:h-[126px] md:w-[211px]">
                              <CloudUpload className="text-gray-300" />
                              <p className="text-gray-500 font-medium text-xl leading-normal">
                                  Preview picture
                              </p>
                          </div>
                          <div className='md:grid md:grid-cols-3 gap-4 space-y-4'>
                              <div
                                  className="flex flex-col items-center justify-center
                               border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
                                  <CloudUpload className="text-gray-300" />
                                  <p className="text-gray-500 font-medium text-xl leading-normal">
                                      Image1
                                  </p>
                              </div>
                              <div
                                  className="flex flex-col items-center justify-center
                               border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
                                  <CloudUpload className="text-gray-300" />
                                  <p className="text-gray-500 font-medium text-xl">
                                      Image 2
                                  </p>
                              </div>
                              <div
                                  className="flex flex-col items-center justify-center
                               border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
                                  <CloudUpload className="text-gray-300" />
                                  <p className="text-gray-500 font-medium text-xl">
                                      Image 3
                                  </p>
                              </div>

                              <div
                                  className="flex flex-col items-center justify-center 
                                   border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
                                  <CloudUpload className="text-gray-300" />
                                  <p className="text-gray-500 font-medium text-xl">
                                      Image 4
                                  </p>
                              </div>
                              <div
                                  className="flex flex-col items-center justify-center 
                               border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
                                  <CloudUpload className="text-gray-300" />
                                  <p className="text-gray-500 font-medium text-xl">
                                      Image 5
                                  </p>
                              </div>
                          </div>
                      </div>
                  </li>
                  <li className="md:flex">
                      <h5 className="mt-4"> Title:</h5>
                      <div className="md:ml-17">
                          <input
                              type="text"
                              placeholder="2 Bedroom Mini Flat in Agbowa"
                              className="border border-[#233670] md:w-[742px] md:h-[67px] pl-5 font-medium md:text-2xl w-69 h-8"
                          />
                      </div>
                  </li>
                  <li className="md:flex">
                      <h5 className="md:mt-4">Address:</h5>
                      <div className="md:ml-6 space-y-5">
                          <input
                              type="text"
                              placeholder="Address Line 1"
                              className="border border-[#233670] md:w-[742px] md:h-[67px] pl-5 font-medium md:text-2xl w-69 h-8"
                          />
                          <input
                              type="text"
                              placeholder="Address Line 2"
                              className="border-[#233670] border md:w-[742px] md:h-[67px] pl-5 font-medium md:text-2xl w-69 h-8"
                          />
                      </div>
                  </li>
                  <li className="md:flex">
                      <h5 className="md:mt-4">Price:</h5>
                      <div className="md:ml-15">
                          <input
                              type="text"
                              placeholder="N10,000,000"
                              className="border border-[#233670] md:w-[742px] md:h-[67px] pl-5 font-medium md:text-2xl w-69 h-8"
                          />
                      </div>
                  </li>
                  <li className="md:flex">
                      <h5 className="mt-4">Category:</h5>
                      <div className="space-x-2 space-y-4 text-white md:ml-6">
                          <button className="bg-blue-900 w-32 h-15 rounded cursor-pointer">
                              RENT
                          </button>
                          <button className="bg-blue-900 w-32 h-15 rounded cursor-pointer">
                              BUY
                          </button>
                          <button className="bg-blue-900 w-32 h-15 rounded cursor-pointer">
                              SELL
                          </button>
                          <button className="bg-blue-900 md:w-39 w-32 h-15 rounded cursor-pointer">
                              SHORTLET
                          </button>
                      </div>
                  </li>
                  <li className="md:flex">
                      <h5 className="mt-4">Rating:</h5>
                      <div className="md:ml-12">
                          <input
                              type="text"
                              placeholder=""
                              className="border border-[#233670] md:w-[742px] md:h-[67px] pl-5 font-medium w-69 h-8"
                          />
                      </div>
                  </li>
                  <li className="md:flex">
                      <h5 className="mt-4">Bed:</h5>
                      <div className="space-x-2 space-y-4 text-white md:ml-18">
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              1Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              2Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              3Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              4Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              5Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              6Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              7Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              8Bdr
                          </button>
                      </div>
                  </li>
                  <div className="md:w-170 h-[2px] w-50  bg-gray-400 md:ml-39"></div>
                  <li className="md:flex">
                      <h5 className="md:mt-4">Bath:</h5>
                      <div className="space-x-2 space-y-4 text-white md:ml-15">
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              1Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              2Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              3Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              4Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              5Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              6Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              7Bdr
                          </button>
                          <button className="bg-blue-900 w-22 h-15 rounded cursor-pointer">
                              8Bdr
                          </button>
                      </div>
                  </li>
                  <li className="flex">
                      <h5 className='md:m-0  mt-1'>Rating:</h5>
                      <div className="md:ml-8 ml-2">
                          <RatingStar rating={3} />
                      </div>
                  </li>
                  <li className="md:flex">
                      <h5 className="mt-4">Listed By:</h5>
                      <div className="md:ml-4">
                          <input
                              type="text"
                              placeholder="Input home owners name"
                              className="border border-[#233670] md:w-[742px] md:h-[67px] h-8 pl-5 font-medium md:text-2xl w-69"
                          />
                      </div>
                  </li>
                  <div>
                      <h3 className="md:text-5xl text-3xl">Features</h3>
                  </div>
                  <li>
                      Building Amenities:
                      <input
                          type="text"
                          placeholder="Prepaid meter, All room en-suite, etc"
                          className="border border-[#233670] md:w-[624px] md:h-[67px]  pl-5 font-medium md:text-2xl md:ml-6 w-77 h-8"
                      />
                  </li>
                  <li>
                      Property Amenities:
                      <input
                          type="text"
                          placeholder="Standby security, 24hrs light,Standby Generator, etc"
                          className="border border-[#233670] md:w-[624px] md:h-[67px] pl-5 font-medium w-77 h-10 md:text-2xl md:ml-6"
                      />
                  </li>
                  <li>
                      Neighbourhood postcode:
                      <input
                          type="text"
                          placeholder="00000"
                          className="border border-[#233670] md:w-[546px] md:h-[67px] pl-5 font-medium md:text-2xl md:ml-6 w-77 h-10"
                      />
                  </li>
                  <li>
                      Nearby Places:
                      <input
                          type="text"
                          placeholder="Around school, Ikeja city mall, govt hospital."
                          className="border border-[#233670] md:w-[678px] md:h-[67px] pl-5 font-medium md:text-2xl md:ml-6 w-77 h-10"
                      />
                  </li>
                  <div className="flex justify-center">
                      <button className="bg-blue-700 md:w-[300px] w-40 h-15 rounded cursor-pointer text-white  ">
                          Submit
                      </button>
                  </div>
              </ul>
          </div>

          <LandlordDashboardFooter />
      </div>
  );
}

export default page
