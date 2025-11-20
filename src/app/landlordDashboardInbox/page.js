"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import LandlordDashboardSidebar from '../../components/landlordDashboardSidebar/index.js';
import LandlordDashboardFooter from '../../components/landlordDashboardFooter/index.js';
import SubscriptionModal1 from '../../components/subscriptionModal1/index.js';

const page = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
      <div>
          <LandlordDashboardSidebar />
          <div className="landlordDashboardInboxContainer">
              <div className="landlordInbox mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)">
                  <h3 className="text-4xl text-blue-800 font-bold">Inbox</h3>
              </div>

              <div className="mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1) flex justify-between">
                  <h5 className="text-xl font-semibold"> my messages</h5>
                  <Link href="/">
                      <p>compose</p>
                  </Link>
                  <img src="/profile_Pic.png" alt="demo" />
                  <button className="cursor-pointer text-white bg-blue-800 p-4"
                              onClick={() => setOpenModal(true)}>
                                show profile
                    </button>
              </div>
          </div>
      <LandlordDashboardFooter />
      {/* MODAL*/}
      <SubscriptionModal1 isOpen={openModal} onClose={() => setOpenModal(false)}  />
      </div>
  );
}

export default page
