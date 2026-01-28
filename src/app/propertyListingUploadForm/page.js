"use client";

import React from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import LandlordDashboardSidebar from '../../components/landlordDashboardSidebar'
import LandlordDashboardFooter from "../../components/landlordDashboardFooter/index.js";
import { CloudUpload } from 'lucide-react';
import RatingStar from '../../components/ratingStar/index.js';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

const page = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        landlord_id: "", Img1: "", Img2: "", Img3: "", Img4: "",
        Img5: "", title: "", address: "", price: "", category: "", 
        unitsAvailable: "", unitsAvailable: "",
        bed: "", bath: "", features: "", listedBy: ""
    });

const [file, setFile] = useState(null);
const [previewPic, setPreviewPic] = useState(null);

function handleChange (e) { 
const img = e.target.files?.[0];
        if (!img) return;

    setFile(img);
    setPreviewPic(URL.createObjectURL(img));

    async function uploadImage() {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "okuper");

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dfdzbuk0c/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            console.log("Cloudinary upload response:", data);

            if (data.secure_url) {
                setFormData((prev) => ({
                    ...prev,
                    Img1: data.secure_url,
                }));
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Image upload failed. Please try again.");
            }
        } catch (err) {
            console.error("Error uploading image to Cloudinary:", err);
            toast.error("Image upload failed. Please try again.");
        }       
    }
}
    
    const [selectedFeatures, setSelectedFeatures] = useState("");

    const handleInputChange = (e) => {
    setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const [error, setError] = useState("");
    const handlePropertyUpload = async (e) => {
        e.preventDefault();
        setError("");

        if (
            !formData.landlord_id ||
            !formData.Img1 || !formData.Img2 || !formData.Img3 ||
            !formData.title || !formData.address || !formData.price ||
            !formData.category || !unitsAvailable || !formData.unitsAvailable ||
            !formData.bed || formData.bath || formData.listedBy ||formData.features 
            ) {
              toast.error("Please fill all required fields");
              return;
            }

        if (!landlord_id) {
          toast.error("You are not a valid landlord. Please signup or signin.");
          return;
        }

        if (!previewPic) { 
            toast.error("Please upload a preview picture");
            return;
        }
    
        if (!Img1 || !Img2 || !Img3) 
            { toast.error("Please upload at least 3 pictures");
            return;
        }
    
        if (!title) {
            toast.error("Please add a title");
            return;
        }
    
        if (!address) {
            toast.error("Please add an address for your property");
            return;
        }
        if (!price) {
            toast.error("Please add a price for your property");
            return;
        }

        if (!category) {
            toast.error("Please select a property category");
            return;
        }

        if (!unitsAvailable) {
            toast.error("Please add a name for listedBy");
            return;
        }

        if (!bed || !bath) {
            toast.error("Please add number of bed and bath");
            return;
        }

        if (!featues) {
            toast.error("Please add property features");
            return;
        }

        if (!listedBy) {
            toast.error("Please add listedBy name");
            return;
        }

        try {
          // Create property
          const propertyRes = await fetch("/api/property", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              landlord_id,
              Img1: formData.Img1,
              Img2: formData.Img2,
              Img3: formData.Img3,
              title: formData.title,
              address: formData.address,
              price: formData.price,
              category: formData.category,
              unitsAvailable: formData.unitsAvailable,
              bed: formData.bed,
              bath: formData.bath,
              features: formData.features,
              listedBy: formData.listedBy,
            }),
          });
    
        const property = await propertyRes.json();
    
        if (!propertyRes.ok) {
            toast.error(property.message || "Failed to create property");
            return;
        }
    
    
          // Subscription
    //       const paymentRes = await fetch("/api/paystack", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           action: "generate",
    //           email: formData.email,
    //           purpose: "verifyPayment",
    //           userType: "landlord",
    //         }),
    //       });
    
    //       if (!PaymentRes.ok) {
    //         toast.error("You are on free trial. Please subscribe.");
    //         return;
    //       }
    
    //       const paymentData = await paymentRes.json();
    //       console.log("Payment details sent to email:", formData.email);
    
    //       // Open Payment modal
    //       setShowLandlordPayment(true);
    //     } catch (err) {
    //       console.error(err);
    //       toast.error("Something went wrong. Please try again.");
    //     }
    //   };


    //   //continue here
    
    //   const handleOtpVerification = async (otpCode) => {
    //     if (!otpCode) return;
    
    //     console.log("Verifying OTP:", otpCode, "for email:", formData.email);
    
    //     try {
    //       const res = await fetch("/api/otp", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           action: "verify",
    //           Img1: formData.Img1,
    //           Img2: formData.Img2,
    //           Img3: formData.Img3,
    //           code: otpCode,
    //           purpose: "verifyAccount",
    //           userType: "landlord",
    //         }),
    //       });
    
    //       const data = await res.json();
    
    //       if (!res.ok) {
    //         console.error("OTP verification failed:", data);
    //         toast.error(data.message || "Invalid OTP or expired");
    //         throw new Error(data.message || "Invalid OTP");
    //       }
    
    //       // Update landlord to verified
    //       const updateRes = await fetch("/api/landlord", {
    //         method: "PUT",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           email: formData.email,
    //           isVerified: true,
    //         }),
    //       });
    
    //       const updateData = await updateRes.json();
    
    //       if (!updateRes.ok) {
    //         console.error("Failed to update landlord:", updateData);
    //         toast.error("Verification successful but failed to update account");
    //         return;
    //       } else {
    //         console.log("✅ Landlord updated to verified");
    //         toast.success("Account verified successfully! 🎉");
    //         setShowOtpLandlord(false);
    //       }
    
    //       // Redirect to landlord signin page
    //       setTimeout(() => {
    //         toast.success("🚀 Redirecting to sign in page...");
    //         router.push("/signInLandlord");
    //       }, 2000);
        } catch (err) {
          console.error(err);
          toast.error("Property upload failed");
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
                <ToastContainer position="top-center" autoClose={3000} />
            </div>
          {/* Form Section*/}
            <div className="bg-white md:w-[1300px] md:h-[2190px] h-750 md:m-8 m-4">
                <ul className="font-semibold md:text-2xl md:space-y-10 space-y-8 p-10 md:pt-20 md:ml-18 ">
                    <li className="md:flex">
                        <h5 className="mt-4">Pictures:</h5>
                        <div className="md:flex gap-5 md:ml-8 space-y-4">
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[211px]"> 
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleChange}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                                id='PreviewPic'
                            />
                                <CloudUpload className="text-gray-300" />
                                <p className="text-gray-500 font-medium text-xl leading-normal">
                                    Preview picture
                                </p>
                        </div>
                        <div className='md:grid md:grid-cols-3 gap-4 space-y-4'>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="absolute w-full h-full opacity-0 cursor-pointer"
                                    id='Image1'
                                />   
                                    <CloudUpload className="text-gray-300" />
                                    <p className="text-gray-500 font-medium text-xl leading-normal">
                                        Image1
                                    </p>
                            </div>
                        
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="absolute w-full h-full opacity-0 cursor-pointer"
                                    id='Image2'
                                />     
                                    <CloudUpload className="text-gray-300" />
                                    <p className="text-gray-500 font-medium text-xl">
                                        Image 2
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="absolute w-full h-full opacity-0 cursor-pointer"
                                        id='Image3'
                                    />  
                                    <CloudUpload className="text-gray-300" />
                                    <p className="text-gray-500 font-medium text-xl">
                                        Image 3
                                    </p>
                                </div>

                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="absolute w-full h-full opacity-0 cursor-pointer"
                                        id='Image4'
                                    />
                                    <CloudUpload className="text-gray-300" />
                                    <p className="text-gray-500 font-medium text-xl">
                                        Image 4
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
                                    <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="absolute w-full h-full opacity-0 cursor-pointer"
                                    id='Image5'
                                    />
                                    <CloudUpload className="text-gray-300" />
                                    <p className="text-gray-500 font-medium text-xl">
                                        Image 5
                                    </p>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="md:flex">
                        <h5 className="mt-4"> Title:</h5>
                        <div className="md:ml-17">
                            <input
                                type="text"
                                name='title'
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="2 Bedroom Mini Flat in Agbowa"
                                className="border border-[#233670] md:w-[760px] w-full md:h-[67px] pl-5 font-medium md:text-2xl h-8"
                            />
                        </div>
                    </li>
                    <li className="md:flex">
                        <h5 className="md:mt-4">Address:</h5>
                        <div className="md:ml-6 space-y-5">
                            <input
                                type="text"
                                name='address'
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Address Line 1"
                                className="border border-[#233670] md:w-[760px] w-full pl-5 font-medium md:text-2xlh-8"
                            />
                            <input
                                type="text"
                                name='address'
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Address Line 2"
                                className="border-[#233670] border md:w-[760px] w-full md:h-[67px] pl-5 font-medium md:text-2xl h-8"
                            />
                        </div>
                    </li>
                    <li className="md:flex">
                        <h5 className="md:mt-4">Price:</h5>
                        <div className="md:ml-15">
                            <input
                                type="text"
                                name='address'
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="N10,000,000"
                                className="border border-[#233670] md:w-[760px] w-full md:h-[67px] pl-5 font-medium md:text-2xl h-8"
                            />
                        </div>
                    </li>
                    <li className="md:flex">
                        <h5 className="mt-4">Category:</h5>
                        <div className="space-x-2 space-y-4 text-white md:ml-6">
                            {["Rent", "Buy", "Sell", "Shortlet"].map((feature) => (
                            <button 
                                key={feature}
                                type='button'
                                onClick={() => {setSelectedFeatures((prev) =>
                                    prev.includes(feature)
                                    ? prev.filter((f) => f !==feature) // remove
                                    : [...prev, feature] // add
                                );
                            }}
                            className={`w-32 h-15 rounded cursor-pointer transition
                                ${
                                    selectedFeatures.includes(feature)
                                        ? "bg-blue-700 text-white"
                                        : "bg-blue-900 text-white"
                                    }
                                `}
                            >
                                {feature}
                            </button>
                            ))}
                        </div>
                    </li>
                    <li className="md:flex">
                        <h5 className="mt-4">Units available</h5>
                        <div className="md:ml-12">
                            <input
                                type="text"
                                placeholder="No. of property available."
                                className="border border-[#233670] md:w-[760px] w-full md:h-[67px] pl-5 font-medium h-8"
                            />
                        </div>
                    </li>

                    <li className="md:flex propertyType">
                        <h5 className="mt-4 mr-6">Property Type:</h5>
                        <div className="space-x-10 space-y-8 text-white ">
                            {["Appartment", "Bungalow", "Office", "Condo", "TownHouse", "Duplex", "SelfCon", "Villa", "BQ", "Other"].map(
                            (feature) => (                      
                                <button 
                                    key={feature}
                                    type='button'
                                    onClick={() => {
                                        setSelectedFeatures((prev) =>
                                        prev.includes(feature)
                                    ? prev.filter((f) => f !== feature) //remove
                                    : [...prev, feature] // add
                                    );
                                }}
                                    className={`md:w-35 w-full h-15 cursor-pointer transition      
                                        ${
                                            selectedFeatures.includes(feature)
                                            ? "bg-blue-700 text-white"
                                            : "bg-blue-900 text-white"
                                        }
                                    `}
                                >
                                    <p className='text-lg md:text-md'>{feature}</p>
                                </button>
                            ))}
                        </div>
                        </li>
                    <li className="md:flex">
                        <h5 className="mt-4">Bed:</h5>
                        <div className="space-x-2 space-y-4 text-white md:ml-18">
                            {["1Bdr", "2Bdr", "3Bdr", "4Bdr", "5Bdr", "6Bdr", "7Bdr", "8Bdr"].map((feature) => (
                            <button 
                                key={feature}
                                type='button'
                                onClick={() => { 
                                    setSelectedFeatures((prev) =>
                                    prev.includes(feature)
                                    ? prev.filter((f) => f !== feature) // remove
                                    : [...prev, feature] // add
                                    );
                                }}
                                className={`w-25 h-15 rounded-full cursor-pointer
                                ${
                                    selectedFeatures.includes(feature)
                                        ? "bg-blue-700 text-white"
                                        : "bg-blue-900 text-white"
                                    }
                                `}
                            >
                                {feature}   
                            </button>
                            ))}
                        </div>
                    </li>

                    <hr className="md:w-200 w-100  border-gray-300 md:ml-39"></hr>

                   <li className="md:flex">
                        <h5 className="mt-4">Bath:</h5>
                        <div className="space-x-2 space-y-4 text-white md:ml-18">
                            {["1Bath", "2Bath", "3Bath", "4Bath", "5Bath", "6Bath", "7Bath", "8Bath"].map((feature) => (
                            <button 
                                key={feature}
                                type='button'
                                onClick={() => {
                                    setSelectedFeatures((prev) =>
                                    prev.includes(feature)
                                    ? prev.filter((f) => f !== feature) // remove
                                    : [...prev, feature] // add
                                );}}
                                className={`w-25 h-15 rounded-full cursor-pointer transition
                                    ${selectedFeatures.includes(feature)
                                        ? "bg-blue-700 text-white"
                                        : "bg-blue-900 text-white"
                                    }
                                `}                            
                            >    
                            {feature}    
                            </button>
                            ))}
                        </div>
                    </li>
                    <li className="flex">
                        <h5 className='md:m-0  mt-1'>Rating:</h5>
                        <div className="md:ml-8 ml-2">
                            <RatingStar rating={3} />
                        </div>
                    </li>
                    <li className="md:flex">
                        <h5 className="mt-4">Listed By:</h5>
                        <div className="md:ml-4">
                            <input
                                type="text"
                                placeholder="Enter fullname or company name."
                                className="border border-[#233670] md:w-[860px] w-full md:h-[67px] h-10 pl-5 font-medium md:text-2xl"
                            />
                        </div>
                    </li>
                    
                        <hr className="md:w-170 w-100 md:my-20 my-15 border-gray-300 md:ml-39"></hr>

                    <div>
                        <h3 className="md:text-5xl text-3xl md:mb-20 mb-10">Features</h3>
                    </div>
                    <li>
                        Building Amenities:
                        <input
                            type="text"
                            placeholder="Prepaid meter, All room en-suite, etc."
                            className="border border-[#233670] md:w-[770px] w-full md:h-[67px] h-10 pl-5 font-medium md:text-2xl md:ml-6h-8"
                        />
                    </li>
                    <li>
                        Property Amenities:
                        <input
                            type="text"
                            placeholder="Standby security, 24hrs light,Standby Generator, etc."
                            className="border border-[#233670] md:w-[747px] w-full md:h-[67px] pl-5 font-medium h-10 md:text-2xl md:ml-6"
                        />
                    </li>
                    <li>
                        Neighbourhood postcode:
                        <input
                            type="text"
                            placeholder="00000"
                            className="border border-[#233670] md:w-[670px] md:h-[67px] pl-5 font-medium md:text-2xl md:ml-6 w-full h-10"
                        />
                    </li>
                    <li>
                        Nearby Places:
                        <input
                            type="text"
                            placeholder="Schools, Malls, Govt hospitals, Central Mosque, etc."
                            className="border border-[#233670] md:w-[800px] w-full md:h-[67px] pl-5 font-medium md:text-2xl md:ml-6 h-10"
                        />
                    </li>
                    <div className="flex justify-center mt-15">
                        <button 
                        onClick={handlePropertyUpload}
                        className="bg-blue-700 md:w-[300px] w-full h-15 rounded cursor-pointer text-white hover:bg-blue-900">
                            Submit
                        </button>
                    </div>
                </ul>
            </div>

          <LandlordDashboardFooter />
        </div>
  );
}

export default page
