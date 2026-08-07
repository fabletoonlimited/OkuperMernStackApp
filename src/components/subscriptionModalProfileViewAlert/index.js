"use client";

import React from 'react'

const index = ({ isOpen, onClose, onContinue }) => {
    if (!isOpen) return null;
    
  return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-stone-900 w-[275px] h-[394px] flex items-center justify-center z-50">
          <div>
                <div className="">
                    <button
                        className="absolute top-3 right-4 text-xl p-1 rounded-full w-8 h-8 text-white hover:text-blue-500 cursor-pointer"
                        onClick={onClose}>
                        x
                    </button>
                </div>

                <div className="text-center text-white space-y-4">
                    <div className=" bg-white rounded-full ml-20 w-28 h-28 m-4 justify-center">
                        <p className="text-red-600 text-center text-6xl pt-10 animate-bounce">x</p>
                    </div>
                    <h2>Error</h2>
                        <p className="text-sm">You are on a free subscription</p>
                    <p>
                        Please upgrade your plan to a premium plan to view your
                        profile
                    </p>
                    <div className="rounded-2">
                        <button 
                            className="bg-blue-700 p-4 px-16 cursor-pointer hover:rounded-full"
                            onClick={onContinue}
                            >Subscibe Now
                        </button>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default index