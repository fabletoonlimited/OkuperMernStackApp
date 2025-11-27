import React, { useState } from 'react';

const ComposeModal = ({
  onClose,
  senderId,
  receiverId,
  propertyId,
  conversation,
  senderType,
  receiverType
}) => {

  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = {
      sender: senderId,
      senderType,
      receiver: receiverId,
      receiverType,
      property: propertyId,
      conversationId: conversation?._id,
      content,
    };

    console.log("Message to send:", message);
    // Message sent successfully

    onClose();
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
              className="px-4 py-2 bg-blue-800 text-white rounded-xl"
            >
              Send
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ComposeModal;
