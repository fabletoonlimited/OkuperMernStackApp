"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter";
import { CloudUpload } from "lucide-react";
import RatingStar from "../../components/ratingStar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = ({ currentUserId }) => { // assume you pass landlord id as prop
  const router = useRouter();

  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const [formData, setFormData] = useState({
    // landlord: currentUserId || "",
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
    propertyType: "",
    unitsAvailable: "",
    bed: "",
    bath: "",
    features: {
      buildingAmenities: [],
      propertyAmenities: [],
      neighbourhoodPostcode: "",
      nearbyPlaces: [],
    },
    listedBy: "",
  });

  const [imagePreviews, setImagePreviews] = useState({
    previewPic: null,
    Img1: null,
    Img2: null,
    Img3: null,
    Img4: null,
    Img5: null,
  });

  const [extraFeatures, setExtraFeatures] = useState({
    buildingAmenities: "",
    propertyAmenities: "",
    neighbourhoodPostcode: "",
    nearbyPlaces: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, features: selectedFeatures }));
  }, [selectedFeatures]);

  /* IMAGE UPLOAD */
  const handleChange = async (e) => {
    const img = e.target.files?.[0];
    if (!img) return;

    const imgKey = e.target.id;

    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "okuper");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfdzbuk0c/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadResult = await res.json();

      if (!uploadResult.secure_url) {
        toast.error("Image upload failed");
        return;
      }

      setImagePreviews((prev) => ({
        ...prev,
        [imgKey]: URL.createObjectURL(img),
      }));

      // wrap image in array object
      setFormData((prev) => ({
        ...prev,
        [imgKey]: [{ publicId: "", url: uploadResult.secure_url }],
      }));

      toast.success(`${imgKey} Image uploaded successfully`);
    } catch (err) {
      console.error(err);
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

    const propertyTypeMap = {
      Apartment: "Apartment",
      Bungalow: "Bungalow",
      Condo: "Condo",
      TownHouse: "Townhouse",
      Duplex: "Duplex",
      Studio: "Studio",
      Villa: "Villa",
      BQ: "BQ",
      Other: "Other",
      House: "House",
      SelfCon: "Other",
      Office: "Other",
    };

    const bedMap = {
      "1Bdr": "1",
      "2Bdr": "2",
      "3Bdr": "3",
      "4Bdr": "4",
      "5Bdr": "5",
      "6Bdr": "6",
      "7Bdr": "7",
      "8Bdr": "8",
    };

    const bathMap = {
      "1Bath": "1",
      "2Bath": "2",
      "3Bath": "3",
      "4Bath": "4",
      "5Bath": "5",
      "6Bath": "6",
      "7Bath": "7",
      "8Bath": "8",
    };

    const propertyType = propertyTypeMap[formData.propertyType] || "Other";
    const bed = bedMap[formData.bed] || "0";
    const bath = bathMap[formData.bath] || "0";

    if (
      // !formData.landlord ||
      !formData.previewPic ||
      !formData.Img1 ||
      !formData.Img2 ||
      !formData.Img3 ||
      !formData.title ||
      !formData.address||
      !formData.price ||
      !formData.category ||
      !formData.unitsAvailable ||
      !bed ||
      !bath ||
      !formData.listedBy
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const featuresPayload = {
      buildingAmenities: extraFeatures.buildingAmenities
        ? extraFeatures.buildingAmenities
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
        : [],
      propertyAmenities: extraFeatures.propertyAmenities
        ? extraFeatures.propertyAmenities
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
        : [],
      neighbourhoodPostcode: extraFeatures.neighbourhoodPostcode || "00000",
      nearbyPlaces: extraFeatures.nearbyPlaces
        ? extraFeatures.nearbyPlaces
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
        : [],
    };

    const formattedAddress = `${formData.address.line1} ${formData.address.line2}`.trim();

    try {
      const res = await fetch("/api/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          propertyType,
          bed,
          bath,
          features: featuresPayload,
          address: formattedAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Upload failed");
        return;
      }

      toast.success("Property uploaded successfully");

      switch (formData.category) {
        case "Rent":
          router.push("/rent");
          break;
        case "Buy":
          router.push("/buy");
          break;
        case "Sell":
          router.push("/sell");
          break;
        case "Shortlet":
          router.push("/shortlet");
          break;
        default:
          router.push("/allProperties");
      }
    } catch (err) {
      console.error(err);
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
          We are thrilled that you have chosen to list your property with Okuper.
        </p>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>

      {/* Form Section*/}
      <div className="bg-white md:w-[1300px] md:h-auto h-750 md:m-8 m-4 md:flex">
        <form onSubmit={handlePropertyUpload}>
          <ul className="font-semibold md:text-2xl md:space-y-10 space-y-8 p-10 md:pt-20 md:ml-18 ">
            {/* Picture Upload Section */}
            <div className="md:flex gap-5 md:ml-8 mb-10">
              <h5 className="mt-4 -ml-7">Pictures:</h5>

              <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[150px] cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute opacity-0 md:h-[126px] md:w-[100px] cursor-pointer"
                  id="previewPic"
                />
                {imagePreviews.previewPic ? (
                  <img
                    src={imagePreviews.previewPic}
                    alt="Preview"
                    className="md:h-[126px] md:w-[150px] object-cover"
                  />
                ) : (
                  <>
                    <CloudUpload className="text-gray-300" />
                    <p className="text-gray-500 font-medium text-xl leading-normal">
                      Preview picture
                    </p>
                  </>
                )}
              </span>

              {/* Image 1 Uploads */}
              <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px] cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute opacity-0 md:h-[126px] md:w-[100px] cursor-pointer"
                  id="Img1"
                />
                {imagePreviews.Img1 ? (
                  <img
                    src={imagePreviews.Img1}
                    alt="Img1 Preview"
                    className="md:h-[126px] md:w-[145px] object-cover"
                  />
                ) : (
                  <>
                    <CloudUpload className="text-gray-300" />
                    <p className="text-gray-500 font-medium text-xl leading-normal">
                      Image1
                    </p>
                  </>
                )}
              </span>

              {/* Image 2 Uploads */}
              <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px] cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute opacity-0 md:h-[126px] md:w-[100px] cursor-pointer"
                  id="Img2"
                />

                {imagePreviews.Img2 ? (
                  <img
                    src={imagePreviews.Img2}
                    alt="Img2 Preview"
                    className="md:h-[126px] md:w-[150px] object-cover"
                  />
                ) : (
                  <>
                    <CloudUpload className="text-gray-300" />
                    <p className="text-gray-500 font-medium text-xl">
                      Image 2
                    </p>
                  </>
                )}
              </span>

              {/* Image 3 Uploads */}
              <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px] cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute opacity-0 md:h-[126px] md:w-[100px] cursor-pointer"
                  id="Img3"
                />

                {imagePreviews.Img3 ? (
                  <img
                    src={imagePreviews.Img3}
                    alt="Img3 Preview"
                    className="md:h-[126px] md:w-[150px] object-cover"
                  />
                ) : (
                  <>
                    <CloudUpload className="text-gray-300" />
                    <p className="text-gray-500 font-medium text-xl">
                      Image 3
                    </p>
                  </>
                )}
              </span>

              {/* Image 4 Uploads */}
              <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px] cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute md:h-[126px] md:w-[100px] opacity-0 cursor-pointer"
                  id="Img4"
                />

                {imagePreviews.Img4 ? (
                  <img
                    src={imagePreviews.Img4}
                    alt="Img4 Preview"
                    className="md:h-[126px] md:w-[150px] object-cover"
                  />
                ) : (
                  <>
                    <CloudUpload className="text-gray-300" />
                    <p className="text-gray-500 font-medium text-xl">
                      Image 4
                    </p>
                  </>
                )}
              </span>

              {/* Image 5 Uploads */}
              <span className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 md:h-[126px] md:w-[145px] cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute md:h-[126px] md:w-[100px] opacity-0 cursor-pointer"
                  id="Img5"
                />

                {imagePreviews.Img5 ? (
                  <img
                    src={imagePreviews.Img5}
                    alt="Img5 Preview"
                    className="md:h-[126px] md:w-[150px] object-cover"
                  />
                ) : (
                  <>
                    <CloudUpload className="text-gray-300" />
                    <p className="text-gray-500 font-medium text-xl">
                      Image 5
                    </p>
                  </>
                )}
              </span>
            </div>

            {/* Property Details Section */}
            <li className="md:flex">
              <h5 className="mt-4"> Title:</h5>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="2 Bedroom Mini Flat in Agbowa"
                className="border border-[#233670] md:ml-17 md:w-[850px] w-full md:h-[67px] pl-5 font-medium md:text-2xl h-8"
              />
            </li>

            <li className="md:flex">
              <h5 className="md:mt-4">Address:</h5>
              <span className="md:ml-6 space-y-5">
                <input
                  type="text"
                  name="address"
                  value={formData.address.line1}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  placeholder="Address Line 1"
                  className="border border-[#233670] md:w-[850px] w-full pl-5 font-medium md:text-2xl md:h-[67px] h-8"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address.line2}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
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
                  name="price"
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
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        category: feature,
                      }))
                    }
                    className={`w-32 h-15 rounded cursor-pointer transition
                      ${
                        formData.category === feature
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
                  name="unitsAvailable"
                  value={formData.unitsAvailable}
                  onChange={handleInputChange}
                  placeholder="No. of property available."
                  className="border border-[#233670] md:w-[760px] w-full md:h-[67px] pl-5 font-medium h-8"
                />
              </span>
            </li>

            <li className="md:flex propertyType">
              <h5 className="mt-4 mr-6">Property Type:</h5>
              <span className="space-x-10 space-y-8 text-white ">
                {[
                  "Apartment",
                  "Bungalow",
                  "Office",
                  "Condo",
                  "TownHouse",
                  "Duplex",
                  "SelfCon",
                  "Villa",
                  "BQ",
                  "Other",
                ].map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        propertyType: feature,
                      }))
                    }
                    className={`md:w-35 w-full h-15 cursor-pointer transition      
                      ${
                        formData.propertyType === feature
                          ? "bg-blue-700 text-white"
                          : "bg-blue-900 text-white"
                      }
                    `}
                  >
                    <p className="text-lg md:text-md">{feature}</p>
                  </button>
                ))}
              </span>
            </li>

            <li className="md:flex">
              <h5 className="mt-4">Bed:</h5>
              <span className="space-x-2 space-y-4 text-white md:ml-18">
                {[
                  "1Bdr",
                  "2Bdr",
                  "3Bdr",
                  "4Bdr",
                  "5Bdr",
                  "6Bdr",
                  "7Bdr",
                  "8Bdr",
                ].map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bed: feature,
                      }))
                    }
                    className={`w-25 h-15 rounded-full cursor-pointer
                      ${
                        formData.bed === feature
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

            <hr className="md:w-200 w-100  border-gray-300 md:ml-39" />

            <li className="md:flex">
              <h5 className="mt-4">Bath:</h5>
              <span className="space-x-2 space-y-4 text-white md:ml-18">
                {[
                  "1Bath",
                  "2Bath",
                  "3Bath",
                  "4Bath",
                  "5Bath",
                  "6Bath",
                  "7Bath",
                  "8Bath",
                ].map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, bath: feature }))
                    }
                    className={`w-25 h-15 rounded-full cursor-pointer transition
                      ${
                        formData.bath === feature
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
              <h5 className="md:m-0  mt-1">Rating:</h5>
              <span className="md:ml-8 ml-2">
                <RatingStar rating={3} />
              </span>
            </li>

            <li className="md:flex">
              <h5 className="mt-4">Listed By:</h5>
              <span className="md:ml-4">
                <input
                  type="text"
                  name="listedBy"
                  value={formData.listedBy}
                  onChange={handleInputChange}
                  placeholder="Enter fullname or company name."
                  className="border border-[#233670] md:w-[860px] w-full md:h-[67px] h-10 pl-5 font-medium md:text-2xl"
                />
              </span>
            </li>

            <hr className="md:w-170 w-100 md:my-20 my-15 border-gray-300 md:ml-39" />

            <span>
              <h3 className="md:text-5xl text-3xl md:mb-20 mb-10">
                Features
              </h3>
            </span>

            <li>
              Building Amenities:
              <input
                type="text"
                name="buidlingAmenities"
                value={extraFeatures.buildingAmenities}
                onChange={(e) =>
                  setExtraFeatures((prev) => ({
                    ...prev,
                    buildingAmenities: e.target.value,
                  }))
                }
                placeholder="Prepaid meter, All room en-suite, etc."
                className="border border-[#233670] md:w-[770px] w-full md:h-[67px] h-10 pl-5 font-medium md:text-2xl md:ml-6h-8"
              />
            </li>

            <li>
              Property Amenities:
              <input
                type="text"
                name="propertyAmenities"
                value={extraFeatures.propertyAmenities}
                onChange={(e) =>
                  setExtraFeatures((prev) => ({
                    ...prev,
                    propertyAmenities: e.target.value,
                  }))
                }
                placeholder="Standby security, 24hrs light,Standby Generator, etc."
                className="border border-[#233670] md:w-[747px] w-full md:h-[67px] pl-5 font-medium h-10 md:text-2xl md:ml-6"
              />
            </li>

            <li>
              Neighbourhood postcode:
              <input
                type="text"
                name="neighbourhoodPostcode"
                value={extraFeatures.neighbourhoodPostcode}
                onChange={(e) =>
                  setExtraFeatures((prev) => ({
                    ...prev,
                    neighbourhoodPostcode: e.target.value,
                  }))
                }
                placeholder="00000"
                className="border border-[#233670] md:w-[670px] md:h-[67px] pl-5 font-medium md:text-2xl md:ml-6 w-full h-10"
              />
            </li>

            <li>
              Nearby Places:
              <input
                type="text"
                name="nearbyPlaces"
                value={extraFeatures.nearbyPlaces}
                onChange={(e) =>
                  setExtraFeatures((prev) => ({
                    ...prev,
                    nearbyPlaces: e.target.value,
                  }))
                }
                placeholder="Schools, Malls, Govt hospitals, Central Mosque, etc."
                className="border border-[#233670] md:w-[800px] w-full md:h-[67px] pl-5 font-medium md:text-2xl md:ml-6 h-10"
              />
            </li>

            <span className="flex justify-center mt-15">
              <button
                type="submit"
                className="bg-blue-700 md:w-[300px] w-full h-15 rounded cursor-pointer text-white hover:bg-blue-900"
              >
                Submit
              </button>
            </span>
          </ul>
        </form>
      </div>

      <LandlordDashboardFooter />
    </div>
  );
};

export default page;
