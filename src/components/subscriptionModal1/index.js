
"use client";

import React from 'react'

const index = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
  return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-900 w-[275px] h-[394px]  flex items-center justify-center z-50">
          <div className=" ">
              <div className="rounded-lg">
                  <button
                      className="absolute top-2 right-2 text-xl bg-white "
                      onClick={onClose}>
                      x
                  </button>
              </div>

              <div className="text-center text-white">
                  <div className=" bg-white rounded-full ml-19 w-28 h-28 m-4">
                      <p className="text-red-600 text-5xl pt-9">x</p>
                  </div>
                  <h2>Error</h2>
                  <p>You are on a free subscription</p>
                  <p>
                      please upgrade your plan to a premium plan to view your
                      profile
                  </p>
                  <button>Subscibe Now</button>
              </div>
          </div>
      </div>
  );
}

export default index