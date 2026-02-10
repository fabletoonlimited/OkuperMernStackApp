"use client"

import React from 'react'
import Landlord from "@/app/api/models/landlordModel"
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar/index.js";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter/index.js";
import PropertyUploadLanding from "../../components/PropertyUploadLanding/index.js";
import { useEffect, useRouter } from "next/router.js";
import SubscriptionModal from "../../components/subscriptionModal1"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";


const page = () => {
    const router = useRouter();

    const handleInputChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

     const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        cardNo: "",
        cvv2: "",
        expDate: "",
      });

        const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
        const [error, setError] = useState("");

        const trimmedEmail = email.trim().toLowerCase();

        const handlePayment = async (e) => {
            e.preventDefault();
            setError("");

           if (
                !formData.firstName ||
                !formData.lastName ||
                !cardNo ||
                !cvv2 || 
                !expDate
                ) {
                    toast.error("Please fill all required fields");
                    return;
                }
          
          //Check if landlord Email Exists in DB
          const existingLandlord = await Landlord.findOne({ email: trimmedEmail });
                
        try{
          //Generate Subscription
          const subscriptionRes = await fetch("api/landlordSubscription", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
              action: "generate",
              email: trimmedEmail,
              cardNo: formData.cardNo,
              cvv2: formData.cvv2,
              expDate: formData.expDate,
              purpose: "subscriptionPayment",
              userType: "landlord"
            })
          })
    
           if (!subscriptionRes.ok) {
            toast.error("Failed to generate Payment. Please try again.");
            return;
          }
    
          const subscriptionData = await subscriptionRes.json();
          console.log("Payment receipt sent to:", formData.email);
    
    
          // Open Set payment modal
            setShowSubscriptionModal(true);
    
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Please try again.");
        }
    }
  return (
      <div>
          <LandlordDashboardSidebar />
          {/* Top Nav Section*/}
          <div className="landlordDashboardlist mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                <h1 className="font-bold md:text-5xl text-2xl pl-7">
                    Dear, Landlord!
                </h1>
                <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify font-medium">
                    We are thrilled that you have chosen to list your property
                    with Okuper.
                </p>
          </div>
            {/* Dashboard Section*/}
            <div className="landlordDashboardproperty mt-8 md:ml-6 md:px-0 px-4">
                <h3 className="font-semibold md:text-4xl text-2xl pl-7 leading-[150%]">
                    Property Listing
                </h3>
                <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify font-medium">
                    Please use the form below to upload two FREE your property.
                </p>
            </div>
          <PropertyUploadLanding />
          <LandlordDashboardFooter />
      </div>
  );
}

export default page