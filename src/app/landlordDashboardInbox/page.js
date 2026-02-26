"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [openCompose, setOpenCompose] = useState(false); // Restored — pending owner confirmation of purpose
  const [inspectionLoading, setInspectionLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);
  const [profileDetails, setProfileDetails] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [currentActorId, setCurrentActorId] = useState(null);
  const [currentActorType, setCurrentActorType] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/user/me", {
          credentials: "include",
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setCurrentActorId(data.actorId || null);
        setCurrentActorType(data.actorType || null);
      } catch (err) {
        console.error("Fetch current user error:", err);
      }
    };

    fetchCurrentUser();
  }, []);

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

        // Mark messages as read and clear badge locally
        await fetch(`/api/message/${selectedConversation._id}/read`, {
          method: "PATCH",
          credentials: "include",
        });
        setConversations((prev) =>
          prev.map((c) =>
            c._id === selectedConversation._id ? { ...c, unreadCount: 0 } : c
          )
        );
      } catch (err) {
        console.error("Fetch messages error:", err);
        toast.error(err.message);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // SSE real-time connection — opens a persistent stream for the selected conversation
  useEffect(() => {
    if (!selectedConversation?._id) return;

    const es = new EventSource(
      `/api/message/stream?conversationId=${selectedConversation._id}`
    );

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "newMessage") {
          setMessages((prev) => {
            // Deduplicate: sender already added optimistically, SSE would double it
            const exists = prev.some((m) => m._id === data.message._id);
            if (exists) return prev;
            return [...prev, data.message];
          });
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, [selectedConversation?._id]);

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

      const resolvedReceiverType =
        normalizeRole(otherParticipant?.role) ||
        (currentActorType === "Landlord" ? "Tenant" : "Tenant");

      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiverId: otherParticipant._id,
          receiverType: resolvedReceiverType,
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

  // Proceed with tenant for inspection
  const handleProceedWithInspection = async () => {
    if (!selectedConversation) return;

    try {
      setInspectionLoading(true);
      const res = await fetch(`/api/message/${selectedConversation._id}/inspection`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to proceed with inspection");
        return;
      }

      // Update conversation status locally
      setSelectedConversation((prev) => ({ ...prev, status: "inspection" }));
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedConversation._id ? { ...c, status: "inspection" } : c
        )
      );
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
      toast.success("Tenant notified for inspection!");
    } catch (err) {
      console.error("Proceed with inspection error:", err);
      toast.error(err.message);
    } finally {
      setInspectionLoading(false);
    }
  };

  // Generic status action handler
  const handleStatusAction = async (endpoint, successMsg) => {
    if (!selectedConversation) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/message/${selectedConversation._id}/${endpoint}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Action failed");
        return;
      }
      setSelectedConversation((prev) => ({ ...prev, status: data.conversation.status }));
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedConversation._id ? { ...c, status: data.conversation.status } : c
        )
      );
      if (data.message) setMessages((prev) => [...prev, data.message]);
      toast.success(successMsg);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Get other participant details
  const normalizeId = (value) => (value ? String(value) : "");
  const normalizeRole = (role) => {
    if (!role) return null;
    if (role === "tenant" || role === "Tenant") return "Tenant";
    if (role === "landlord" || role === "Landlord") return "Landlord";
    return role;
  };

  const getOtherParticipantForConversation = (conversation) => {
    if (!conversation?.participants?.length) return null;
    if (!currentActorId) return conversation.participants[0] || null;

    return (
      conversation.participants.find(
        (participant) =>
          normalizeId(participant?._id) !== normalizeId(currentActorId),
      ) ||
      conversation.participants[0] ||
      null
    );
  };

  const getOtherParticipant = (conversation = selectedConversation) =>
    getOtherParticipantForConversation(conversation);

  const otherParticipant = profileDetails || getOtherParticipant();
  const profilePic = otherParticipant?.profilePic || otherParticipant?.avatar;

  useEffect(() => {
    if (!selectedConversation) {
      setProfileDetails(null);
      return;
    }

    setProfileDetails(null);
  }, [selectedConversation]);

  useEffect(() => {
    if (!showProfile) return;
    if (!selectedConversation) return;

    const participant = getOtherParticipant();
    if (!participant?._id) return;

    let isActive = true;
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await fetch(`/api/profile?actorId=${participant._id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        if (isActive) {
          setProfileDetails(data.profile || null);
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        if (isActive) {
          setProfileLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isActive = false;
    };
  }, [showProfile, selectedConversation]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LandlordDashboardSidebar />
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md p-6 rounded-md mb-6">
          <h3 className="text-3xl font-bold text-blue-800">Inbox</h3>
        </div>

        <div className="bg-white shadow-md rounded-md flex min-h-[75vh]">
          <div className="flex-1 flex flex-col mb-0">
            <div className="p-4 border-gray-200 shadow-4xl shadow-gray-300 border-2 flex items-center justify-between">
              <div className="flex items-center gap-12">
                <h5
                  className="font-bold text-blue-950"
                  style={{ fontSize: "20px" }}
                >
                  My messages
                </h5>

                {/* Compose button — pending owner confirmation of purpose (see Figma) */}
                <button
                  onClick={() => setOpenCompose(true)}
                  className="bg-blue-800 text-white px-6 py-2 hover:bg-blue-700 rounded"
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
                  onClick={() => setShowProfile((prev) => !prev)}
                  className="bg-blue-800 text-white px-6 py-2 hover:bg-blue-700"
                >
                  {showProfile ? "Back" : "Show Profile"}
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
                    const other = getOtherParticipantForConversation(conv);
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
                          {(other?.avatar || other?.profilePic) && (
                            <Image
                              src={other.avatar || other.profilePic}
                              alt="avatar"
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p
                              className="font-light text-black"
                              style={{ fontSize: "12px" }}
                            >
                              {other?.name}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-blue-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-black">
                            {conv.property?.title}
                          </p>
                          {conv.status && conv.status !== "active" && (
                            <span
                              className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-white capitalize ${
                                conv.status === "inspection" ? "bg-amber-500" :
                                conv.status === "accepted"   ? "bg-blue-600"  :
                                conv.status === "completed"  ? "bg-green-600" :
                                conv.status === "rejected"   ? "bg-red-500"   :
                                                               "bg-gray-400"
                              }`}
                              style={{ fontSize: "9px" }}
                            >
                              {conv.status}
                            </span>
                          )}
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
                  profileLoading && !profileDetails ? (
                    <p className="p-4 text-gray-500">Loading profile...</p>
                  ) : (
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
                  )
                ) : selectedConversation && messages.length > 0 ? (
                  <div className="p-4 bg-white h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <p className="text-blue-950 font-bold text-2xl">
                        {selectedConversation.property?.title}
                      </p>

                      {/* Status action buttons — change based on conversation stage */}
                      <div className="flex gap-2 flex-wrap">
                        {selectedConversation.status === "active" && (
                          <button
                            onClick={handleProceedWithInspection}
                            disabled={inspectionLoading}
                            className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-green-700 hover:bg-green-600 disabled:bg-gray-400 transition duration-200"
                          >
                            {inspectionLoading ? "Processing..." : "Proceed with Inspection"}
                          </button>
                        )}

                        {selectedConversation.status === "inspection" && (
                          <>
                            <button
                              onClick={() => handleStatusAction("accept", "Tenant accepted!")}
                              disabled={actionLoading}
                              className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-blue-700 hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
                            >
                              Accept Tenant
                            </button>
                            <button
                              onClick={() => handleStatusAction("reject", "Tenant rejected after inspection.")}
                              disabled={actionLoading}
                              className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-gray-400 transition duration-200"
                            >
                              Reject After Inspection
                            </button>
                            <button
                              onClick={() => handleStatusAction("cancel", "Inspection cancelled.")}
                              disabled={actionLoading}
                              className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 transition duration-200"
                            >
                              Cancel Inspection
                            </button>
                          </>
                        )}

                        {selectedConversation.status === "accepted" && (
                          <button
                            onClick={() => handleStatusAction("complete", "Rental marked as completed!")}
                            disabled={actionLoading}
                            className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-purple-700 hover:bg-purple-600 disabled:bg-gray-400 transition duration-200"
                          >
                            {actionLoading ? "Processing..." : "Mark as Completed"}
                          </button>
                        )}

                        {["completed", "rejected", "cancelled"].includes(selectedConversation.status) && (
                          <span className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize ${
                            selectedConversation.status === "completed" ? "bg-green-100 text-green-800" :
                            selectedConversation.status === "rejected" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {selectedConversation.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                      {messages.map((msg, idx) => {
                        const senderId =
                          msg?.sender && typeof msg.sender === "object"
                            ? msg.sender._id || msg.sender.id
                            : msg.sender;
                        const fromOther =
                          normalizeId(senderId) ===
                          normalizeId(otherParticipant?._id);

                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg ${
                              fromOther
                                ? "bg-gray-200 text-left"
                                : "bg-blue-200 text-right ml-auto"
                            } max-w-xs`}
                          >
                            <p className="font-semibold text-sm">
                              {fromOther ? otherParticipant?.name : "You"}
                            </p>
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="flex flex-col gap-1">
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
                          maxLength={1000}
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={handleSendReply}
                          disabled={replyLoading || replyText.length > 1000}
                          className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {replyLoading ? "Sending..." : "Send"}
                        </button>
                      </div>
                      <p className={`text-xs text-right ${replyText.length >= 1000 ? "text-red-500" : "text-gray-400"}`}>
                        {replyText.length}/1000
                      </p>
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
            {/* ComposeModal — restored for owner review, not yet wired to send */}
            {openCompose && (
              <ComposeModal
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
