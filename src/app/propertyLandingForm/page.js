
import React from 'react'
import LandlordDashboardSidebar from '../../components/landlordDashboardSidebar'
import LandlordDashboardFooter from "../../components/landlordDashboardFooter/index.js";
import { CloudUpload } from 'lucide-react';

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
          <div className="bg-white md:w-[1300px] md:h-[1800px] h-210 m-8 flex justify-center">
              <ul className="font-semibold text-2xl space-y-10 p-10 pt-20">
                  <li className="flex">
                      <h5>Pictures:</h5>
                      <div className="grid grid-cols-4 gap-5 ml-8">
                          <div
                              className="flex flex-col items-center justify-center
                                border-2 border-dashed border-gray-400 h-[126px] w-[211px]">
                              <CloudUpload className="text-gray-300" />
                              <p className="text-gray-500 font-medium text-xl">
                                  Preview picture
                              </p>
                          </div>
                          <div
                              className="flex flex-col items-center justify-center
                               border-2 border-dashed border-gray-400 h-[126px] w-[145px]">
                              <CloudUpload className="text-gray-300" />
                              <p className="text-gray-500 font-medium text-xl">
                                  Image1
                              </p>
                          </div>
                          <div
                              className="flex flex-col items-center justify-center
                               border-2 border-dashed border-gray-400 h-[126px] w-[145px]">
                              <CloudUpload className="text-gray-300" />
                              <p className="text-gray-500 font-medium text-xl">
                                  Image 2
                              </p>
                          </div>
                          <div
                              className="flex flex-col items-center justify-center
                               border-2 border-dashed border-gray-400 h-[126px] w-[145px]">
                              <CloudUpload className="text-gray-300" />
                              <p className="text-gray-500 font-medium text-xl">
                                  Image 3
                              </p>
                          </div>
                          <div
                              className="flex flex-col items-center justify-center 
                               border-2 border-dashed border-gray-400 h-[126px] w-[145px]">
                              <CloudUpload className="text-gray-300" />
                              <p className="text-gray-500 font-medium text-xl">
                                  Image 4
                              </p>
                          </div>
                          <div
                              className="flex flex-col items-center justify-center 
                               border-2 border-dashed border-gray-400 h-[126px] w-[145px]">
                              <CloudUpload className="text-gray-300" />
                              <p className="text-gray-500 font-medium text-xl">
                                  Image 5
                              </p>
                          </div>
                      </div>
                  </li>
                  <li className="flex">
                      <h5> Title:</h5>
                      <div className="ml-17">
                          <input
                              type="text"
                              placeholder="2 Bedroom Mini Flat in Agbowa"
                              className="border w-[742px] h-[67px] pl-5 font-medium text-2xl"
                          />
                      </div>
                  </li>
                  <li className="flex">
                      <h5>Address:</h5>
                      <div className="ml-6">
                          <input
                              type="text"
                              placeholder="Address Line 1"
                              className="border w-[742px] h-[67px] pl-5 font-medium text-2xl"
                          />
                      </div>
                  </li>
                  <li>Price:</li>
                  <li>Category:</li>
                  <li>Rating:</li>
                  <li>Bed:</li>
                  <li>Bath:</li>
                  <li>Rating:</li>
                  <li>Listed By:</li>
              </ul>
          </div>
          <LandlordDashboardFooter />
      </div>
  );
}

export default page
