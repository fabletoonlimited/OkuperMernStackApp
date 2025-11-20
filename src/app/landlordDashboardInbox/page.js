"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LandlordDashboardSidebar from '../../components/landlordDashboardSidebar'
import LandlordDashboardFooter from '../../components/landlordDashboardFooter'
import { CldImage } from 'next-cloudinary'
import { toast, ToastContainer } from "react-toastify"


function Message({ id }) {

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

  // Example: adjust based on your actual backend structure
  const publicId1 = backendMessage?.sender?.profilePic;

  return (
    <div className='landlordDashboardInboxContainer'>
      <LandlordDashboardSidebar />

      <div className="landlordInbox mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <h3 className="text-4xl text-blue-800 font-bold">Inbox</h3>
      </div>

      <div className="landlordinbox mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex gap-6">

        <div className='flex items-center gap-4'>

          <h5 className="text-xl font-semibold text-blue-950">My messages</h5>

          <Link href="/compose">
            <p className='text-blue-800 cursor-pointer'>Compose</p>
          </Link>

          {/* Display pic */}
          <div className='w-20 h-20 rounded-full overflow-hidden bg-gray-200'>

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

        <div>
          <Link href="/">
            <button 
              onClick={() => setOpenModal()}
              className="cursor-pointer bg-blue-800 w-40 h-10 text-white text-lg">
              Show Profile
            </button>
          </Link>
        </div>
      </div>

      <LandlordDashboardFooter />
      <ToastContainer />
    </div>
  );
}

export default Message;
