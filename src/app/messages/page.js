"use client";

import React, { useState, useEffect } from "react";
import TenantDashboardSidebar from "../../components/tenantDashboardSidebar";
import TenantDashboardFooter from "../../components/tenantDashboardFooter";
import { CldImage } from "next-cloudinary";
import { toast, ToastContainer } from "react-toastify";
import SubscriptionModal1 from "../../components/subscriptionModal1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import ComposeModal from "../../components/composeModal";
import Image from "next/image";

function TenantMessages({ id }) {
  const [openCompose, setOpenCompose] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [backendMessage, setBackendMessage] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchMessageData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/message/${id}`,
          { credentials: "include" },
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
      email: "titilola.giwa1@example.com",
      gender: "Female",
      age: 32,
      occupation: "Product Manager",
      maritalStatus: "Married",
      spouseName: "Oluwaseun Giwa",
      numberOfChildren: 2,
      religion: "Christianity",
      companyName: "TechNova Ltd",
      companyPhone: "+234 801 234 5678",
      companyEmail: "hr@technova.com",
      currentAddress: "15 Bourdillon Road",
      city: "Ikoyi",
      state: "Lagos",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
      documentType: "National ID",
      idNumber: "NIN-0012345678",
      documentImage: "/documents/national-id-1.jpg",
    },
    {
      id: 2,
      name: "Titilola Giwa",
      email: "titilola.giwa2@example.com",
      gender: "Female",
      age: 28,
      occupation: "UX Designer",
      maritalStatus: "Single",
      spouseName: "",
      numberOfChildren: 0,
      religion: "Christianity",
      companyName: "DesignHub",
      companyPhone: "+234 802 345 6789",
      companyEmail: "contact@designhub.com",
      currentAddress: "22 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      property: "4Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
      documentType: "Driver License",
      idNumber: "DL-9876543210",
      documentImage: "/documents/driver-license-2.jpg",
    },
    {
      id: 3,
      name: "Titilola Giwa",
      email: "titilola.giwa3@example.com",
      gender: "Female",
      age: 35,
      occupation: "Business Analyst",
      maritalStatus: "Married",
      spouseName: "Kunle Ade",
      numberOfChildren: 3,
      religion: "Christianity",
      companyName: "FinEdge Corp",
      companyPhone: "+234 803 456 7890",
      companyEmail: "info@finedge.com",
      currentAddress: "8 Banana Island Road",
      city: "Ikoyi",
      state: "Lagos",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
      documentType: "International Passport",
      idNumber: "P123456789",
      documentImage: "/documents/passport-3.jpg",
    },
    {
      id: 4,
      name: "Titilola Giwa",
      email: "titilola.giwa4@example.com",
      gender: "Female",
      age: 40,
      occupation: "HR Consultant",
      maritalStatus: "Divorced",
      spouseName: "",
      numberOfChildren: 1,
      religion: "Christianity",
      companyName: "PeopleFirst Ltd",
      companyPhone: "+234 804 567 8901",
      companyEmail: "support@peoplefirst.com",
      currentAddress: "12 Osborne Road",
      city: "Ikoyi",
      state: "Lagos",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
      documentType: "Voters Card",
      idNumber: "PVC-44556677",
      documentImage: "/documents/voters-card-4.jpg",
    },
    {
      id: 5,
      name: "Titilola Giwa",
      email: "titilola.giwa5@example.com",
      gender: "Female",
      age: 29,
      occupation: "Marketing Executive",
      maritalStatus: "Single",
      spouseName: "",
      numberOfChildren: 0,
      religion: "Christianity",
      companyName: "BrandWave",
      companyPhone: "+234 805 678 9012",
      companyEmail: "hello@brandwave.com",
      currentAddress: "5 Freedom Way",
      city: "Lekki",
      state: "Lagos",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
      documentType: "National ID",
      idNumber: "NIN-5566778899",
      documentImage: "/documents/national-id-5.jpg",
    },
    {
      id: 6,
      name: "Titilola Giwa",
      email: "titilola.giwa6@example.com",
      gender: "Female",
      age: 37,
      occupation: "Operations Manager",
      maritalStatus: "Married",
      spouseName: "Adekunle Giwa",
      numberOfChildren: 2,
      religion: "Christianity",
      companyName: "LogiPro Services",
      companyPhone: "+234 806 789 0123",
      companyEmail: "admin@logipro.com",
      currentAddress: "18 Chevron Drive",
      city: "Lekki",
      state: "Lagos",
      property: "3Brd Apartment in Bourdillon, Lekki",
      message: "Good morning, My name is Juliet Ibhadiyi, I'd like to d",
      unread: true,
      avatar: "/avatar1.jpg",
      documentType: "Driver License",
      idNumber: "DL-1122334455",
      documentImage: "/documents/driver-license-6.jpg",
    },
  ];

  const profilePic = backendMessage?.sender?.profilePic;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md p-6 rounded-md mb-6">
          <h3 className="text-3xl font-bold text-blue-800">Inbox</h3>
        </div>

        <div className="bg-white shadow-md rounded-md flex min-h-[75vh]">
          <TenantDashboardSidebar />

          <div className="flex-1 flex flex-col mb-0">
            <div className="p-4 border-gray-200 shadow-4xl shadow-gray-300 border-2 flex items-center justify-between">
              <div className="flex items-center gap-12">
                <h5
                  className="font-bold text-blue-950"
                  style={{ fontSize: "20px" }}
                >
                  My messages
                </h5>

                <button
                  onClick={() => setOpenCompose(true)}
                  className="text-blue-800 hover:underline mt-14"
                  style={{ fontSize: "12px" }}
                >
                  Compose
                </button>

                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {profilePic && (
                    <CldImage
                      src={profilePic}
                      width={60}
                      height={60}
                      crop="fill"
                      alt="profile"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowProfile(true)}
                  className="bg-blue-800 text-white px-6 py-2 hover:bg-blue-700"
                >
                  Show Profile
                </button>

                <div className="border-2 border-blue-700 rounded-md w-10 h-10 flex items-center justify-center text-blue-700">
                  <FontAwesomeIcon icon={faFlag} />
                </div>
              </div>
            </div>

            <div className="flex flex-1">
              <div className="w-full md:w-1/3 bg-white border-gray-200 border-4">
                {inboxMessages.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedMessage(item);
                      setShowProfile(false);
                    }}
                    className="flex gap-3 px-2 py-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={item.avatar}
                        alt="avatar"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p
                        className="font-light text-black"
                        style={{ fontSize: "12px" }}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs font-semibold text-black">
                        {item.property}
                      </p>
                      <p
                        className="font-light text-black whitespace-pre-line"
                        style={{ fontSize: "10px" }}
                      >
                        {item.message.replace(/(My name)\b/i, "$1\n")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block flex-1 p-4 bg-gray-50">
                {showProfile ? (
                  <div className="p-8 border-t border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-black">
                    {/* Avatar */}
                    <h4 className="text-2xl font-bold mb-4 text-blue-950">
                      <Image
                        src={selectedMessage?.avatar}
                        alt="avatar"
                        width={120}
                        height={120}
                        className="rounded-full"
                      />
                    </h4>

                    {/* Name */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Name: </strong>
                      <span className="font-light">
                        {selectedMessage?.name}
                      </span>
                    </p>

                    {/* Email */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Email: </strong>
                      <span className="font-light">
                        {selectedMessage?.email}
                      </span>
                    </p>

                    {/* Document Type */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Document Type: </strong>
                      <span className="font-light">
                        {selectedMessage?.documentType}
                      </span>
                    </p>

                    {/* ID Number */}
                    <p className="text-xl mb-2 text-center">
                      <strong>ID No: </strong>
                      <span className="font-light">
                        {selectedMessage?.idNumber}
                      </span>
                    </p>

                    {/* Document Image */}
                    {selectedMessage?.documentImage && (
                      <div className="mt-4">
                        <Image
                          src={selectedMessage?.documentImage}
                          alt="Document"
                          width={300}
                          height={160}
                          className="rounded-md border mb-6"
                        />
                      </div>
                    )}
                    <hr className="rotate-90 " />

                    {/* Gender */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Gender: </strong>
                      <span className="font-light">
                        {selectedMessage?.gender}
                      </span>
                    </p>

                    {/* Age */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Age: </strong>
                      <span className="font-light">{selectedMessage?.age}</span>
                    </p>

                    {/* Occupation */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Occupation: </strong>
                      <span className="font-light">
                        {selectedMessage?.occupation}
                      </span>
                    </p>

                    {/* Marital Status */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Marital Status: </strong>
                      <span className="font-light">
                        {selectedMessage?.maritalStatus}
                      </span>
                    </p>

                    {/* Spouse Name & No of Children if Married */}
                    {selectedMessage?.maritalStatus === "Married" && (
                      <>
                        <p className="text-xl mb-2 text-center">
                          <strong>Spouse Name: </strong>
                          <span className="font-light">
                            {selectedMessage?.spouseName}
                          </span>
                        </p>
                        <p className="text-xl mb-2 text-center">
                          <strong>No of Children: </strong>
                          <span className="font-light">
                            {selectedMessage?.numberOfChildren}
                          </span>
                        </p>
                      </>
                    )}

                    {/* Religion */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Religion: </strong>
                      <span className="font-light">
                        {selectedMessage?.religion}
                      </span>
                    </p>

                    {/* Company Name */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Company Name: </strong>
                      <span className="font-light">
                        {selectedMessage?.companyName}
                      </span>
                    </p>

                    {/* Company Phone */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Company Phone: </strong>
                      <span className="font-light">
                        {selectedMessage?.companyPhone}
                      </span>
                    </p>

                    {/* Company Email */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Company Email: </strong>
                      <span className="font-light">
                        {selectedMessage?.companyEmail}
                      </span>
                    </p>

                    {/* Current Address */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Current Address: </strong>
                      <span className="font-light">
                        {selectedMessage?.currentAddress}
                      </span>
                    </p>
                    <hr className="rotate-90" />

                    {/* 2x2 Grid for City, State, Country, Zip Code */}
                    <div className="grid grid-cols-2 gap-2 text-xl mt-2 w-full max-w-sm">
                      <p className="text-center">
                        <strong>City: </strong>
                        <span className="font-light">
                          {selectedMessage?.city}
                        </span>
                      </p>
                      <p className="text-center">
                        <strong>State: </strong>
                        <span className="font-light">
                          {selectedMessage?.state}
                        </span>
                      </p>
                      <p className="text-center">
                        <strong>Country: </strong>
                        <span className="font-light">
                          {selectedMessage?.country}
                        </span>
                      </p>
                      <p className="text-center">
                        <strong>Zip Code: </strong>
                        <span className="font-light">
                          {selectedMessage?.zipCode}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : selectedMessage ? (
                  <div className="p-17 bg-white h-full items-center">
                    <p className="text-blue-950 font-bold text-2xl mb-10">
                      {selectedMessage.property}
                    </p>
                    <p
                      className="font-extralight mb-6"
                      style={{ fontSize: 17 }}
                    >
                      <strong className="font-bold">Sender:</strong>{" "}
                      {selectedMessage.name}
                    </p>
                    <p
                      className="font-extralight mb-6"
                      style={{ fontSize: 17 }}
                    >
                      <strong className="font-bold">Receiver:</strong> Joshua
                    </p>
                    <p className="font-extralight" style={{ fontSize: 17 }}>
                      {selectedMessage.message}
                    </p>
                    <p>
                      <input
                        type="text"
                        className="w-full py-14 border-3 border-gray-200 rounded-3xl mt-20"
                      />
                      <p className="bg-blue-800 text-white px-20 py-2 mt-7 hover:bg-blue-700 cursor-pointer inline-block rounded-3xl ml-50">
                        Reply
                      </p>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400">Select a message to view</p>
                )}
              </div>
            </div>

            <TenantDashboardFooter />
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantMessages;
