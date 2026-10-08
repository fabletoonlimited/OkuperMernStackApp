"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TenantDashboardSidebar from "@/components/tenantDashboardSidebar";

const Page = () => {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [role, setRole] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Get logged-in user's role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/user/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setRole(null);
          return;
        }

        const data = await res.json();
        setRole(data.role || null);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setRole(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserRole();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    if (role !== "tenant") {
      toast.error("Only tenants can upload a utility bill here.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      // Tenant sends ONLY the utility bill
      formData.append("utilityBill", file);

      const res = await fetch("/api/uploads/utilityBill", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const uploadResult = await res.json();

      console.log("TENANT UTILITY UPLOAD RESULT:", uploadResult);

      if (!res.ok) {
        toast.error(uploadResult.error || "Upload failed.");
        return;
      }

      toast.success("Utility bill uploaded successfully!");

      setTimeout(() => {
        router.push("/tenantDashboard");
      }, 1000);

    } catch (error) {
      console.error("UTILITY UPLOAD ERROR:", error);
      toast.error("An error occurred while uploading.");
    } finally {
      setUploading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 -mt-30">
     {/* Sidebar */}
        <TenantDashboardSidebar />

      <h1 className="text-4xl font-black mb-4 text-center">
        Upload your utility (LAWMA, WATER or LIGHT) bill.
      </h1>

      <p className="text-center">
        Please upload your current LAWMA, water, or electricity utility bill.
      </p>

      <form
        onSubmit={handleSubmit}
        className="cursor-pointer text-gray-600 text-center flex flex-col items-center justify-center my-10 border-2 border-dashed rounded-lg p-6 w-full max-w-md"
      >
        <input
          type="file"
          name="utilityBill"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />

        <CloudUpload className="text-gray-300 my-4" />

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-900 cursor-pointer text-white px-20 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Page;