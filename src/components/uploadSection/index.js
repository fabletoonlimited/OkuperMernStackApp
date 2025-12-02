"use client";
import Link from 'next/link';
import React, {useState} from 'react'
import SubscriptionModal2 from "../../components/subscriptionModal2"

const index = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
      <div className="bg-white md:w-[1300px] md:h-[2098px] h-210 m-8">
          {/* Grid container */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:px-50">
              <div className="flex flex-col items-center mt-8">
                  <div className="md:w-60 md:h-60 w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="md:text-[200px] text-7xl font-bold text-gray-400">
                          +
                      </span>
                  </div>

                  <Link href="/propertyListingUploadForm">
                      <button className="mt-4 bg-blue-700 text-white px-6 py-2 md:px-10 md:py-4 md:text-xl rounded cursor-pointer font-medium">
                          Start uploading
                      </button>
                  </Link>
              </div>
              <div className="flex flex-col items-center mt-8">
                  <div className="md:w-60 md:h-60 w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="md:text-[200px] text-7xl font-bold text-gray-400">
                          +
                      </span>
                  </div>

                  <Link href="/propertyListingUploadForm">
                      <button className="mt-4 bg-blue-700 text-white px-6 py-2 md:px-10 md:py-4 md:text-xl rounded cursor-pointer font-medium">
                          Start uploading
                      </button>
                  </Link>
              </div>
              <div className="flex flex-col items-center mt-8">
                  <div className="md:w-60 md:h-60 w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="md:text-[200px] text-7xl font-bold text-gray-400">
                          +
                      </span>
                  </div>

                  <button
                      onClick={() => setIsOpen(true)}
                      className="mt-4 bg-blue-700 text-white md:px-10 md:py-4 px-6 py-2 rounded cursor-pointer md:text-xl font-medium">
                      Start uploading
                  </button>
                  {/* Modal Component */}
                  <SubscriptionModal2
                      isOpen={isOpen}
                      onClose={() => setIsOpen(false)}
                  />
              </div>
          </div>
      </div>
  );
              
}

export default index