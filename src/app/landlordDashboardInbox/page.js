"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LandlordDashboardSidebar from '../../components/landlordDashboardSidebar/index.js'
import LandlordDashboardFooter from '../../components/landlordDashboardFooter/index.js'
import { CldImage } from 'next-cloudinary'
import { toast, ToastContainer } from "react-toastify"
import SubscriptionModal1 from '../../components/subscriptionModal1/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import ComposeModal from "../../components/composeModal/index.js"
import landlordDashboard from '../landlordDashboard/page'


function Message({ id }) {
  const [openCompose, setOpenCompose] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [backendMessage, setBackendMessage] = useState(null);

  useEffect(() => {
    const fetchMessageData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/message/${id}`,
          { credentials: "include" }
        );

        if (!response.ok) {
          toast.error("❌ Fetch failed:", response.status);
          return;
        }

        const data = await response.json();
        setBackendMessage(data);
      } catch (error) {
        toast.error("Error fetching message data:", error);
      }
    };

    fetchMessageData();
  }, [id]);

  const publicId1 = backendMessage?.sender?.profilePic;

  return (
      <div className="landlordDashboardInboxContainer">
          <LandlordDashboardSidebar />

        {/*Fist Top Nav*/}
          <div className="landlordInbox mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
              <h3 className="text-4xl text-blue-800 font-bold">Inbox</h3>
          </div>

        {/*Second Top Nav*/}
          <div className="landlordinbox items-center mt-8 p-6 px-15 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex gap-6">
            <div className="flex items-center gap-x-15">
              <h5 className="text-2xl font-semibold text-blue-950">
                My messages
              </h5>

                <p 
                  className="text-blue-800 cursor-pointer pt-13"
                  onClick={() => setOpenCompose(true)}
                >
                {openCompose && (
                <ComposeModal
                  onClose={() => setOpenCompose(false)}
                  senderId={backendMessage?.sender?._id}
                  senderType={backendMessage?.sender?.role}
                  receiverId={backendMessage?.receiver?._id}
                  receiverType={backendMessage?.receiver?.role}   // "tenant" OR "landlord"
                  propertyId={backendMessage?.property?._id}
                  conversation={backendMessage?.conversation}
                />
              )}
                  Compose
                </p>

              {/* Display pic */}
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                {publicId1 && (
                <CldImage
                  src={publicId1}
                  width={80}
                  height={80}
                  crop="fill"
                  gravity="auto"
                  alt="profile"
                />
                )}
              </div>
            </div>

            <div className='flex ml-150 gap-x-10 items-center report&ShowProfile'>
              <button
                onClick={() => setOpenModal(true)}
                className="cursor-pointer bg-blue-800 w-40 h-10 text-white text-lg">
                  Show Profile
              </button>

              <div className='border-2 border-blue-700 rounded-lg w-16 h-12 text-center pt-2'><FontAwesomeIcon style={{width: 30, height:30, color: "#0545C3"}} icon={faFlag}/></div>
            </div>
          </div>
          <SubscriptionModal1 isOpen={openModal} onClose={() => setOpenModal(false)} />
          <LandlordDashboardFooter />
          <ToastContainer />
      </div>
  );
}

export default Message;
