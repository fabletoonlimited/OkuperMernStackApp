
"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CloudUpload } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UtilityBillUploadPage() {
  const router = useRouter();
  const params = useParams();

  const propertyId = params?.propertyId;

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!propertyId || typeof propertyId !== "string") {
      toast.error("Property ID is missing. Open this page from your property.");
      return;
    }

    if (!file) {
      toast.error("Please select a utility bill.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("utilityBill", file);
      formData.append("propertyId", propertyId);

      const res = await fetch("/api/uploads/utilityBill", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(
          result.message ||
            result.error ||
            "Utility bill upload failed."
        );
        return;
      }

      toast.success("Utility bill uploaded successfully!");

      const category = result.property?.category;

      switch (category) {
        case "Rent":
          router.push("/rent");
          break;

        case "Buy":
        case "Sell":
          router.push("/buy");
          break;

        case "Shortlet":
          router.push("/shortlets");
          break;

        default:
          router.push("/landlordDashboardComplete");
          break;
      }
    } catch {
      toast.error("An error occurred while uploading the utility bill.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="md:flex flex-col items-center justify-center min-h-screen p-4 mt-20">
      <h1 className="md:text-4xl text-2xl text-blue-900 font-black mb-4 px-5">
        Upload your utility (LAWMA, WATER or LIGHT) bill.
      </h1>

      <p className="text-black px-5">
        Please ensure that the address on your utility bill matches the
        address on file for property verification.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center my-10 border-2 border-dashed rounded-lg p-6 w-full max-w-md"
      >
        <input
          type="file"
          name="utilityBill"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className="cursor-pointer text-gray-600"
        />

        <CloudUpload className="text-gray-300 mt-4" />

        <button
          type="submit"
          disabled={uploading || !propertyId}
          className="mt-6 bg-blue-900 cursor-pointer text-white px-10 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload utility bill"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}
