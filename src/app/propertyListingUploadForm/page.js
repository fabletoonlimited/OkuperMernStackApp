"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter";
import { CloudUpload } from "lucide-react";
import RatingStar from "../../components/ratingStar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    landlord_id: "",
    previewPic: "",
    Img1: "",
    Img2: "",
    Img3: "",
    Img4: "",
    Img5: "",
    title: "",
    address: "",
    price: "",
    category: "",
    unitsAvailable: "",
    bed: "",
    bath: "",
    features: [],
    listedBy: "",
  });

  const [previewPic, setPreviewPic] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  /* keep features synced */
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      features: selectedFeatures,
    }));
  }, [selectedFeatures]);

  /* IMAGE UPLOAD */
  const handleChange = async (e) => {
    const img = e.target.files?.[0];
    if (!img) return;

    const localPreview = URL.createObjectURL(img);
    setPreviewPic(localPreview);
    setFormData((prev) => ({ 
        ...prev, 
        previewPic: result.secure_url 
    }));

    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "okuper");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfdzbuk0c/image/upload",
        { method: "POST", body: data }
      );

      const result = await res.json();

      if (!result.secure_url) {
        toast.error("Image upload failed");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        Img1: prev.Img1 || result.secure_url,
        Img2: prev.Img1 && !prev.Img2 ? result.secure_url : prev.Img2,
        Img3:
          prev.Img1 && prev.Img2 && !prev.Img3
            ? result.secure_url
            : prev.Img3,
      }));

      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload error");
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* SUBMIT */
  const handlePropertyUpload = async (e) => {
    e.preventDefault();

    if (
      !formData.previewPic ||
      !formData.Img1 ||
      !formData.Img2 ||
      !formData.Img3 ||
      !formData.title ||
      !formData.address ||
      !formData.price ||
      !formData.category ||
      !formData.unitsAvailable ||
      !formData.bed ||
      !formData.bath ||
      !formData.listedBy ||
      formData.features.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Upload failed");
        return;
      }

      toast.success("Property uploaded successfully");
    } catch (err) {
      toast.error("Property upload failed");
    }
  };

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
            <div className="bg-white md:w-[1300px] md:h-auto h-750 md:m-8 m-4 md:flex">
                <ul className="font-semibold md:text-2xl md:space-y-10 space-y-8 p-10 md:pt-20 md:ml-18 ">
                    <div className="md:flex gap-5 md:ml-8 space-y-4">
                        <h5 className="mt-4 -ml-7">Pictures:</h5>
                            <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[150px]"> 
                            {previewPic ? (    
                                <img
                                    src={previewPic}
                                    alt="Preview"
                                    className="absolute w-full h-full object-cover opacity-0 cursor-pointer"
                                    id='previewPic'
                                />
                                ):(
                                <CloudUpload className="text-gray-300" />
                                )}
                                <p className="text-gray-500 font-medium text-xl leading-normal">
                                    Preview picture
                                </p>
                            </span>
                        
                            <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
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
                            </span>
                        
                            <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
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
                            </span>

                            <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
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
                            </span>

                            <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
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
                            </span>
                            <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px]">
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
                            </span>
                        
                    </div>
                
                    <li className="md:flex">
                        <h5 className="mt-4"> Title:</h5>
                        <span className="md:ml-17">
                            <input
                                type="text"
                                name='title'
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="2 Bedroom Mini Flat in Agbowa"
                                className="border border-[#233670] md:w-[850px] w-full md:h-[67px] pl-5 font-medium md:text-2xl h-8"
                            />
                        </span>
                    </li>
                    <li className="md:flex">
                        <h5 className="md:mt-4">Address:</h5>
                        <span className="md:ml-6 space-y-5">
                            <input
                                type="text"
                                name='address'
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Address Line 1"
                                className="border border-[#233670] md:w-[850px] w-full pl-5 font-medium md:text-2xl md:h-[67px] h-8"
                            />
                            <input
                                type="text"
                                name='address'
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Address Line 2"
                                className="border-[#233670] border md:w-[850px] w-full md:h-[67px] pl-5 font-medium md:text-2xl h-8"
                            />
                        </span>
                    </li>
                    <li className="md:flex">
                        <h5 className="md:mt-4">Price:</h5>
                        <span className="md:ml-15">
                            <input
                                type="text"
                                name='price'
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="N10,000,000"
                                className="border border-[#233670] md:w-[850px] w-full md:h-[67px] pl-5 font-medium md:text-2xl h-8"
                            />
                        </span>
                    </li>
                    <li className="md:flex">
                        <h5 className="mt-4">Category:</h5>
                        <span className="space-x-2 space-y-4 text-white md:ml-6">
                            {["Rent", "Buy", "Sell", "Shortlet"].map((feature) => (
                            <button 
                                key={feature}
                                type='button'
                                onClick={() => { setFormData((prev) => ({ ...prev, category: feature })
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
                        </span>
                    </li>
                    <li className="md:flex">
                        <h5 className="mt-4">Units available</h5>
                        <span className="md:ml-12">
                            <input
                                type="text"
                                placeholder="No. of property available."
                                className="border border-[#233670] md:w-[760px] w-full md:h-[67px] pl-5 font-medium h-8"
                            />
                        </span>
                    </li>

                    <li className="md:flex propertyType">
                        <h5 className="mt-4 mr-6">Property Type:</h5>
                        <span className="space-x-10 space-y-8 text-white ">
                            {["Appartment", "Bungalow", "Office", "Condo", "TownHouse", "Duplex", "SelfCon", "Villa", "BQ", "Other"].map(
                            (feature) => (                      
                                <button 
                                    key={feature}
                                    type='button'
                                    onClick={() => {setFormData((prev) => prev.includes(feature)
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
                        </span>
                        </li>
                    <li className="md:flex">
                        <h5 className="mt-4">Bed:</h5>
                        <span className="space-x-2 space-y-4 text-white md:ml-18">
                            {["1Bdr", "2Bdr", "3Bdr", "4Bdr", "5Bdr", "6Bdr", "7Bdr", "8Bdr"].map((feature) => (
                            <button 
                                key={feature}
                                type='button'
                                onClick={() => {
                                    setFormData((prev) => ({...prev, bed:feature})
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
                        </span>
                    </li>

                    <hr className="md:w-200 w-100  border-gray-300 md:ml-39"></hr>

                   <li className="md:flex">
                        <h5 className="mt-4">Bath:</h5>
                        <span className="space-x-2 space-y-4 text-white md:ml-18">
                            {["1Bath", "2Bath", "3Bath", "4Bath", "5Bath", "6Bath", "7Bath", "8Bath"].map((feature) => (
                            <button 
                                key={feature}
                                type='button'
                                onClick={() => {
                                    setFormData((prev) => ({...prev, bath:feature})
                                    ? prev.filter((f) => f !== feature) // remove
                                    : [...prev, feature] // add
                                );
                            }}
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
                        </span>
                    </li>
                    <li className="flex">
                        <h5 className='md:m-0  mt-1'>Rating:</h5>
                        <span className="md:ml-8 ml-2">
                            <RatingStar rating={3} />
                        </span>
                    </li>
                    <li className="md:flex">
                        <h5 className="mt-4">Listed By:</h5>
                            <span className="md:ml-4">
                                <input
                                    type="text"
                                    name='listedBy'
                                    value={formData.listedBy}
                                    onChange={handleInputChange}
                                    placeholder="Enter fullname or company name."
                                    className="border border-[#233670] md:w-[860px] w-full md:h-[67px] h-10 pl-5 font-medium md:text-2xl"
                                />
                            </span>
                    </li>
                    
                        <hr className="md:w-170 w-100 md:my-20 my-15 border-gray-300 md:ml-39"></hr>

                    <span>
                        <h3 className="md:text-5xl text-3xl md:mb-20 mb-10">Features</h3>
                    </span>
                    <li>
                        Building Amenities:
                        <input
                            type="text"
                            name='features'
                            value={formData.features}
                            onChange={handleInputChange}
                            placeholder="Prepaid meter, All room en-suite, etc."
                            className="border border-[#233670] md:w-[770px] w-full md:h-[67px] h-10 pl-5 font-medium md:text-2xl md:ml-6h-8"
                        />
                    </li>
                    <li>
                        Property Amenities:
                        <input
                            type="text"
                            name='features'
                            value={formData.features}
                            onChange={handleInputChange}
                            placeholder="Standby security, 24hrs light,Standby Generator, etc."
                            className="border border-[#233670] md:w-[747px] w-full md:h-[67px] pl-5 font-medium h-10 md:text-2xl md:ml-6"
                        />
                    </li>
                    <li>
                        Neighbourhood postcode:
                        <input
                            type="text"
                            name='features'
                            value={formData.features}
                            onChange={handleInputChange}
                            placeholder="00000"
                            className="border border-[#233670] md:w-[670px] md:h-[67px] pl-5 font-medium md:text-2xl md:ml-6 w-full h-10"
                        />
                    </li>
                    <li>
                        Nearby Places:
                        <input
                            type="text"
                            name='features'
                            value={formData.features}
                            onChange={handleInputChange}
                            placeholder="Schools, Malls, Govt hospitals, Central Mosque, etc."
                            className="border border-[#233670] md:w-[800px] w-full md:h-[67px] pl-5 font-medium md:text-2xl md:ml-6 h-10"
                        />
                    </li>
                    <span className="flex justify-center mt-15">
                        <button onClick={handlePropertyUpload} className="bg-blue-700 md:w-[300px] w-full h-15 rounded cursor-pointer text-white hover:bg-blue-900">
                            Submit
                        </button>
                    </span>
                </ul>
            </div>

          <LandlordDashboardFooter />
        </div>
  );
}

export default page
