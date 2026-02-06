"use client";

import React, { useState, useEffect } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter";
import { CldImage } from "next-cloudinary";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import ComposeModal from "../../components/composeModal";
import Image from "next/image";

function LandlordInbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [openCompose, setOpenCompose] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);

  // Fetch all conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/message", {
          credentials: "include",
        });

        if (!res.ok) {
          toast.error("Failed to fetch conversations");
          return;
        }

        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error("Fetch conversations error:", err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/message/${selectedConversation._id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          toast.error("Failed to fetch messages");
          return;
        }

        const data = await res.json();
        setMessages(data.messages || []);
        setShowProfile(false);
      } catch (err) {
        console.error("Fetch messages error:", err);
        toast.error(err.message);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Handle sending reply
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setReplyLoading(true);
      if (!otherParticipant) {
        toast.error("No recipient found");
        return;
      }

      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiverId: otherParticipant._id,
          receiverType: otherParticipant.role || "Tenant",
          propertyId: selectedConversation.property?._id,
          content: replyText,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to send message");
        return;
      }

      const data = await res.json();
      setMessages([...messages, data.message]);
      setReplyText("");
      toast.success("Message sent!");
    } catch (err) {
      console.error("Send message error:", err);
      toast.error(err.message);
    } finally {
      setReplyLoading(false);
    }
  };

  // Get other participant details
  const getOtherParticipant = () => {
    if (!selectedConversation) return null;
    // This would need to be determined properly based on current user
    return selectedConversation.participants?.[0] || null;
  };

  const otherParticipant = getOtherParticipant();
  const profilePic = otherParticipant?.profilePic;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md p-6 rounded-md mb-6">
          <h3 className="text-3xl font-bold text-blue-800">Inbox</h3>
        </div>

        <div className="bg-white shadow-md rounded-md flex min-h-[75vh]">
          <LandlordDashboardSidebar />

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
              <div className="w-full md:w-1/3 bg-white border-gray-200 border-4 overflow-y-auto">
                {loading ? (
                  <p className="p-4 text-gray-500">Loading conversations...</p>
                ) : conversations.length === 0 ? (
                  <p className="p-4 text-gray-500">No conversations</p>
                ) : (
                  conversations.map((conv) => {
                    const lastMsg = conv.lastMessage;
                    return (
                      <div
                        key={conv._id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`flex gap-3 px-2 py-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                          selectedConversation?._id === conv._id
                            ? "bg-blue-100"
                            : ""
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                          {conv.participants[0]?.avatar && (
                            <Image
                              src={conv.participants[0].avatar}
                              alt="avatar"
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <p
                            className="font-light text-black"
                            style={{ fontSize: "12px" }}
                          >
                            {conv.participants[0]?.name}
                          </p>
                          <p className="text-xs font-semibold text-black">
                            {conv.property?.title}
                          </p>
                          <p
                            className="font-light text-black truncate"
                            style={{ fontSize: "10px" }}
                          >
                            {lastMsg?.content}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="hidden md:block flex-1 p-4 bg-gray-50 overflow-y-auto">
                {showProfile ? (
                  <div className="p-8 border-t border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-black">
                    {/* Avatar */}
                    <h4 className="text-2xl font-bold mb-4 text-blue-950">
                      <Image
                        src={otherParticipant?.avatar || "/avatar1.jpg"}
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
                        {otherParticipant?.name}
                      </span>
                    </p>

                    {/* Email */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Email: </strong>
                      <span className="font-light">
                        {otherParticipant?.email}
                      </span>
                    </p>

                    {/* Document Type */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Document Type: </strong>
                      <span className="font-light">
                        {otherParticipant?.documentType || "N/A"}
                      </span>
                    </p>

                    {/* ID Number */}
                    <p className="text-xl mb-2 text-center">
                      <strong>ID No: </strong>
                      <span className="font-light">
                        {otherParticipant?.idNumber || "N/A"}
                      </span>
                    </p>

                    {/* Document Image */}
                    {otherParticipant?.documentImage && (
                      <div className="mt-4">
                        <Image
                          src={otherParticipant?.documentImage}
                          alt="Document"
                          width={300}
                          height={160}
                          className="rounded-md border mb-6"
                        />
                      </div>
                    )}

                    <hr className="w-full my-4 border-gray-300" />

                    {/* Gender */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Gender: </strong>
                      <span className="font-light">
                        {otherParticipant?.gender || "N/A"}
                      </span>
                    </p>

                    {/* Age */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Age: </strong>
                      <span className="font-light">
                        {otherParticipant?.age || "N/A"}
                      </span>
                    </p>

                    {/* Occupation */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Occupation: </strong>
                      <span className="font-light">
                        {otherParticipant?.occupation || "N/A"}
                      </span>
                    </p>

                    {/* Marital Status */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Marital Status: </strong>
                      <span className="font-light">
                        {otherParticipant?.maritalStatus || "N/A"}
                      </span>
                    </p>

                    {/* Spouse Name & No of Children if Married */}
                    {otherParticipant?.maritalStatus === "Married" && (
                      <>
                        <p className="text-xl mb-2 text-center">
                          <strong>Spouse Name: </strong>
                          <span className="font-light">
                            {otherParticipant?.spouseName || "N/A"}
                          </span>
                        </p>
                        <p className="text-xl mb-2 text-center">
                          <strong>No of Children: </strong>
                          <span className="font-light">
                            {otherParticipant?.numberOfChildren || "0"}
                          </span>
                        </p>
                      </>
                    )}

                    {/* Religion */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Religion: </strong>
                      <span className="font-light">
                        {otherParticipant?.religion || "N/A"}
                      </span>
                    </p>

                    {/* Company Name */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Company Name: </strong>
                      <span className="font-light">
                        {otherParticipant?.companyName || "N/A"}
                      </span>
                    </p>

                    {/* Company Phone */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Company Phone: </strong>
                      <span className="font-light">
                        {otherParticipant?.companyPhone || "N/A"}
                      </span>
                    </p>

                    {/* Company Email */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Company Email: </strong>
                      <span className="font-light">
                        {otherParticipant?.companyEmail || "N/A"}
                      </span>
                    </p>

                    {/* Current Address */}
                    <p className="text-xl mb-2 text-center">
                      <strong>Current Address: </strong>
                      <span className="font-light">
                        {otherParticipant?.currentAddress || "N/A"}
                      </span>
                    </p>

                    <hr className="w-full my-4 border-gray-300" />

                    {/* 2x2 Grid for City, State, Country, Zip Code */}
                    <div className="grid grid-cols-2 gap-4 text-xl mt-2 w-full max-w-sm">
                      <p className="text-center">
                        <strong>City: </strong>
                        <span className="font-light">
                          {otherParticipant?.city || "N/A"}
                        </span>
                      </p>
                      <p className="text-center">
                        <strong>State: </strong>
                        <span className="font-light">
                          {otherParticipant?.state || "N/A"}
                        </span>
                      </p>
                      <p className="text-center">
                        <strong>Country: </strong>
                        <span className="font-light">
                          {otherParticipant?.country || "N/A"}
                        </span>
                      </p>
                      <p className="text-center">
                        <strong>Zip Code: </strong>
                        <span className="font-light">
                          {otherParticipant?.zipCode || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : selectedConversation && messages.length > 0 ? (
                  <div className="p-4 bg-white h-full flex flex-col">
                    <p className="text-blue-950 font-bold text-2xl mb-4">
                      {selectedConversation.property?.title}
                    </p>

                    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${
                            msg.sender === otherParticipant?._id
                              ? "bg-gray-200 text-left"
                              : "bg-blue-200 text-right ml-auto"
                          } max-w-xs`}
                        >
                          <p className="font-semibold text-sm">
                            {msg.sender === otherParticipant?._id
                              ? otherParticipant?.name
                              : "You"}
                          </p>
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !replyLoading) {
                            handleSendReply();
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleSendReply}
                        disabled={replyLoading}
                        className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {replyLoading ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </div>
                ) : selectedConversation ? (
                  <p className="text-gray-400 text-center mt-10">
                    No messages in this conversation
                  </p>
                ) : (
                  <p className="text-gray-400 text-center mt-10">
                    Select a conversation to view messages
                  </p>
                )}
              </div>
            </div>

            <LandlordDashboardFooter />
            <ToastContainer />
            {openCompose && (
              <ComposeModal
                isOpen={openCompose}
                onClose={() => setOpenCompose(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandlordInbox;
