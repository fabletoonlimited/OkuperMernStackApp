"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' 
import { CloudUpload } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const page = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/user/me", 
          { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setRole(data.role || null);
          }
        } catch (err) {
          console.error("Failed to fetch user role:", err);
        setRole(null);
      }
    };
    fetchUserRole();
  }, []);


  const handleSubmit = async () => {

      if (!file) {
          toast.error("Please select a file.");
          return;
        }
        setUploading(true)
        
        try {
          const formData = new FormData()
          formData.append('utilityBill', file)

          const res = await fetch("/api/uploads/utilityBill",{
          method: "POST",
          body: formData,
        }
    );

      const uploadResult = await res.json();

      if (res.ok) {
        const imageUrl = uploadResult.url;
        console.log("File uploaded successfully:", imageUrl);

        toast.success("File uploaded successfully!");

      if (role === "tenant") {
        router.push("/tenantDashboard")
      } else {
        router.push("/landlordDashboard")
      }
      } else {
        console.error("Upload failed:", uploadResult);
        toast.error("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error("An error occured while uploading")
    } finally {
      setUploading(false)
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", 
          { credentials: "include" });
            setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };
      checkAuth();
  },  []);


  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/signUpLanding");
  //   }
  // }, [isAuthenticated, router]);

    // Fetch the logged-in user's ID from the JWT cookie on mount
    useEffect(() => {
      const fetchUserId = async () => {
        try {
          const res = await fetch("/api/user/me", 
            { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setUserId(data.actorId || null);
          }
        } catch (err) {
          console.error("Failed to fetch user ID:", err);
        }
      };
      fetchUserId();
    }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 -mt-30">
      <h1 className='text-4xl font-black mb-4'>Upload your utility (LAWMA, WATER or LIGHT) bill.</h1>
      <p> Please ensure that your address on the utility bill matches the one on file for property verification.</p>
        
        <form 
          onSubmit={handleSubmit}
          className="cursor-pointer text-gray-600 text-center flex flex-col items-center justify-center my-10 border-2 border-dashed rounded-lg p-6 w-full max-w-md"
        >
          <input 
            type="file" 
            name="utilityBill" 
            accept=".pdf,.jpg,.jpeg,.png" 
            onChange={(e) => setFile(e.target.files[0])}
            required 
          />
           <CloudUpload className="text-gray-300" />
        
        </form>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={uploading}
            className=" bg-blue-900 cursor-pointer text-white px-50 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
          >
            Upload
          </button>
      <ToastContainer />
    </div>
  )
}

export default page
