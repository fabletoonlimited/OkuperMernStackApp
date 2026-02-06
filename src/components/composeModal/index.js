import React, { useState } from "react";
import { toast } from "react-toastify";

const ComposeModal = ({
  onClose,
  senderId,
  receiverId,
  propertyId,
  conversation,
  senderType,
  receiverType,
  onMessageSent,
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!receiverId || !propertyId) {
      toast.error("Missing receiver or property information");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiverId,
          receiverType,
          propertyId,
          content,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to send message");
        return;
      }

      const data = await res.json();
      toast.success("Message sent successfully!");

      if (onMessageSent) {
        onMessageSent(data);
      }

      onClose();
    } catch (err) {
      console.error("Send message error:", err);
      toast.error(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 px-10 w-full max-w-lg shadow-xl">
        <h2 className="text-3xl font-semibold py-5">Compose Message</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="font-medium">Sender:</p>
            <input
              type="text"
              className="w-full border rounded-xl p-2"
              value={senderId}
              readOnly
            />
          </div>

          <div>
            <p className="font-medium">Receiver:</p>
            <input
              type="text"
              className="w-full border rounded-xl p-2"
              value={receiverId}
              readOnly
            />
          </div>

          <div>
            <p className="font-medium">Property:</p>
            <input
              type="text"
              className="w-full border rounded-xl p-2"
              value={propertyId}
              readOnly
            />
          </div>

          <div>
            <p className="font-medium">Message:</p>
            <textarea
              className="w-full border rounded-xl p-2 h-24"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your message here..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-xl cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-800 text-white rounded-xl disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeModal;
