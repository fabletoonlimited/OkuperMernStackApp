"use client";

import React, { useState, useEffect } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter";
import { CldImage } from "next-cloudinary";
import { toast, ToastContainer } from "react-toastify";
import SubscriptionModal1 from "../../components/subscriptionModal1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import ComposeModal from "../../components/composeModal";
import Image from "next/image";

function Message({ id }) {
  const [openCompose, setOpenCompose] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [backendMessage, setBackendMessage] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    const fetchMessageData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/message/${id}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          toast.error(`Fetch failed: ${res.status}`);
          return;
        }

        const data = await res.json();
        setBackendMessage(data);
        setActiveConversation(data?.conversation?.[0]);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchMessageData();
  }, [id]);

  const inboxMessages = [
    {
      id: 1,
      name: "Titilola Giwa",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
    },
    {
      id: 2,
      name: "Titilola Giwa",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
    },
    {
      id: 3,
      name: "Titilola Giwa",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
    },
    {
      id: 4,
      name: "Titilola Giwa",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
    },
{
      id: 5,
      name: "Titilola Giwa",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
    },
    {
      id: 6,
      name: "Titilola Giwa",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
    },

  ];

  const profilePic = backendMessage?.sender?.profilePic;
  const currentUserId = backendMessage?.receiver?._id;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LandlordDashboardSidebar />

      <div className="flex-1 p-6">
        {/* Title */}
        <div className="bg-white shadow-md p-6 rounded-md mb-6">
          <h3 className="text-3xl font-bold text-blue-800">Inbox</h3>
        </div>

        {/* Main Layout */}
        <div className="bg-white shadow-md rounded-md flex min-h-[75vh]">
          {/* LEFT — Inbox List */}
         
 

          {/* RIGHT — Messages */}
          <div className="flex-1 flex flex-col ml-68">
            {/* Header */}
            <div className="p-4 border-gray-200 border-2 flex items-center justify-between">
              <div className="flex items-center gap-12">
                <h5 className=" font-bold text-blue-950" style={{fontSize: '20px'}}>
                  My messages
                </h5>

                <button
                  onClick={() => setOpenCompose(true)}
                  className="text-blue-800 hover:underline mt-14 " style={{fontSize: '12px'}}
                >
                  Compose
                </button>

                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {profilePic && (
                    <CldImage
                      src={profilePic}
                      width={60}
                      height={60 }
                      crop="fill"
                      alt="profile"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setOpenModal(true)}
                  className="bg-blue-800 text-white px-6 py-2  hover:bg-blue-700"
                >
                  Show Profile
                </button>

                <div className="border-2 border-blue-700 rounded-md w-10 h-10 flex items-center justify-center text-blue-700">
                  <FontAwesomeIcon icon={faFlag} />
                </div>
              </div>
            </div>

            {/* Inbox Messages */}
            <div className="w-full md:w-1/3 x bg-white">
              

              {inboxMessages.map((item) => (
                <div
  key={item}
  className="flex gap-3 px-2 py-1 border-gray-200 border-2 hover:bg-gray-50 cursor-pointer"
>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={item.avatar}
                      alt="avatar"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p className=" font-light text-black" style={{fontSize: '12px'}}>
                      {item.name}
                    </p>
                    <p className="text-xs font-semibold text-black">
                      {item.property}
                    </p>
                  
<p className="font-light text-black whitespace-pre-line" style={{fontSize: '10px'}}>
  {item.message.replace(
    /(My name)\b/i,
    "$1\n"
  )}
</p>


                  </div>

                  
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modals */}
        <SubscriptionModal1
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        />

        {openCompose && (
          <ComposeModal
            onClose={() => setOpenCompose(false)}
            senderId={backendMessage?.sender?._id}
            senderType={backendMessage?.sender?.role}
            receiverId={backendMessage?.receiver?._id}
            receiverType={backendMessage?.receiver?.role}
            propertyId={backendMessage?.property?._id}
            conversation={backendMessage?.conversation}
          />
        )}

        <LandlordDashboardFooter />
        <ToastContainer />
      </div>
    </div>
  );
}

export default Message;
