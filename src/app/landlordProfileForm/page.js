"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { CloudUpload } from "lucide-react";
// import { status } from "init";


const emptyProfile = {
    previewPic: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    documentType: "",
    idNumber: "",
    documentImage: "",
    status: "",
    gender: "",
    age: "",
    homeAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
};

const steps = [
    { key: "basic", title: "Basic Info" },
    { key: "identity", title: "Identity" },
    { key: "personal", title: "Personal" },
    { key: "address", title: "Address" },
];

const options = {
    documentType: [
        { value: "", label: "Select document type" },
        { value: "passport", label: "Passport" },
        { value: "nin", label: "National ID (NIN)" },
    ],
    gender: [
        { value: "", label: "Select gender" },
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
    ],

    stateOfOrigin: [
        { value: "", label: "Select state of origin" },
        { value: "Abia", label: "Abia" },
        { value: "Adamawa", label: "Adamawa" },
        { value: "Akwa Ibom", label: "Akwa Ibom" },
        { value: "Anambra", label: "Anambra" },
        { value: "Bauchi", label: "Bauchi" },
        { value: "Bayelsa", label: "Bayelsa" },
        { value: "Benue", label: "Benue" },
        { value: "Borno", label: "Borno" },
        { value: "Cross River", label: "Cross River" },
        { value: "Delta", label: "Delta" },
        { value: "Ebonyi", label: "Ebonyi" },
        { value: "Edo", label: "Edo" },
        { value: "Ekiti", label: "Ekiti" },
        { value: "Enugu", label: "Enugu" },
        { value: "Gombe", label: "Gombe" },
        { value: "Imo", label: "Imo" },
        { value: "Jigawa", label: "Jigawa" },
        { value: "Kaduna", label: "Kaduna" },
        { value: "Kano", label: "Kano" },
        { value: "Katsina", label: "Katsina" },
        { value: "Kebbi", label: "Kebbi" },
        { value: "Kogi", label: "Kogi" },
        { value: "Kwara", label: "Kwara" },
        { value: "Lagos", label: "Lagos" },
        { value: "Nasarawa", label: "Nasarawa" },
        { value: "Niger", label: "Niger" },
        { value: "Ogun", label: "Ogun" },
        { value: "Ondo", label: "Ondo" },
        { value: "Osun", label: "Osun" },
        { value: "Oyo", label: "Oyo" },
        { value: "Plateau", label: "Plateau" },
        { value: "Rivers", label: "Rivers" },
        { value: "Sokoto", label: "Sokoto" },
        { value: "Taraba", label: "Taraba" },
        { value: "Yobe", label: "Yobe" },
        { value: "Zamfara", label: "Zamfara" },
        { value: "FCT", label: "FCT" },
    ],
};

const inputClass = "w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-sm focus:border-blue-800 focus:outline-none";
const labelClass = "text-sm font-semibold text-blue-950";

const LandlordProfilePage = ({ landlordProfile }) => {
    const router = useRouter();
      
    const [formData, setFormData] = useState(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [role, setRole] = useState(null);
    const [imagePreviews, setImagePreviews] = useState({});
    const [landlord, setLandlord] = useState(false)
    const [landlorProfile, setLandlordProfile] = useState(false)

    useEffect(() => {
        if (!landlordProfile) return;

        setFormData((prev) => ({
            ...prev,
            ...landlordProfile,
        }));
    }, [landlordProfile]);

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch("/api/landlord", {
                method: "GET",
                credentials: "include",
                });
                
                if (!res.ok) {
                toast.error("Failed to fetch landlord");
                return;
                }
                
                    const data = await res.json();
                    setLandlord(data);
                          
                // Landlord fields
                setFormData((prev) => ({
                    ...prev,
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                }));

                } catch (err) {
                    console.error(err);
                    toast.error("Landlord fetch error");
                }
            };
            fetchLandlord();
        }, []);
        
        useEffect(() => {
            const fetchProfile = async () => {
                try {
                    const res = await fetch("/api/landlordProfile/upload", {
                        method: "GET",
                        credentials: "include",
                    });
        
                    if (!res.ok) {
                        if (res.status === 404) {
                            setLoading(false);
                            return
                        }

                        toast.error("Failed to load landlord profile");
                        return;
                    }
        
                    const data = await res.json();  

                    console.log(data); 

                setLandlordProfile(data);

                setFormData((prev) => ({
                    ...prev,

                    previewPic: data.previewPic || "",
                    phone: data.phone || "",
                    documentType: data.documentType || "",
                    idNumber: data.idNumber || "",
                    status: data.status || "",
                    gender: data.gender || "",
                    age: data.age || "",
                    homeAddress: data.homeAddress || "",
                    city: data.city || "",
                    state: data.state || "",
                    country: data.country || "",
                    zipCode: data.zipCode || "",
                    documentType: data.documentType || "",
                }));
    
                } catch (err) {
                    console.error("Profile fetch error:", err);
                    toast.error("Failed to load profile");
                } finally {
                    setLoading(false);
                }
            };
        
                fetchProfile();
        }, []);


    const progressPercent = useMemo(() => {
        if (!steps.length) return 0;
        return Math.round(((stepIndex + 1) / steps.length) * 100);
    }, [stepIndex]);

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleUpload = async (e, field) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            const payload = new FormData();
            payload.append("file", file);

            const res = await fetch("/api/landlordProfile/upload", {
                method: "POST",
                credentials: "include",
                body: payload,
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Upload failed");
                return;
            }

            setFormData((prev) => ({ 
                ...prev, 
                [field]: data.url,
            }));

        console.log("UPLOAD FINISH");
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submit Called");
        
        if (!formData.firstName || !formData.lastName) {
                toast.error("Please complete required fields");
                return;
            }

        if (stepIndex !== steps.length - 1) return;

        if (!formData.previewPic) {
            toast.error("please upload a diplay picture");
            return;
        }

        if (!formData.gender) {
            toast.error("please add your gender");
            return;
        }

        if (!formData.homeAddress) {
            toast.error("kindly fill current address");
            return
        }
        if (!formData.stateOfOrigin) {
            toast.error("kindly fill state of origin");
            return
        }

        try {
            setSaving(true);
            const res = await fetch("/api/landlordProfile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to update profile");
                return;
            }

            toast.success("Profile updated successfully");

            router.push( 
                role === "landlord"
                ? "/landlordDashboard"
                : "/tenantDashboard",
            );

        } catch (err) {
            console.error("Profile update error:", err);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };
    const renderStep = () => {
        if (stepIndex === 0) {
            return (
                <div>
                    
                    <label className={labelClass}>
                        Profile Picture
                        <div className="mt-2 flex flex-col hover:bg-blue-100 hover:cursor-pointer gap-3 rounded-lg border border-dashed border-blue-200 bg-blue-50 p-4">
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleUpload(e, "previewPic")}
                                src={""}
                                className="text-sm"
                            />
                            
                            <div className="text-xs text-gray-600">
                                {
                                    uploading
                                    ? "Uploading document..."
                                    : formData.previewPic
                                    ? "Document uploaded successfully"
                                    : "Upload a clear image or PDF of your ID"
                                }
                            </div>

                            {formData.previewPic && (
                                <a
                                href={formData.previewPic}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-blue-900 underline">
                                View uploaded document
                                </a>
                            )}  
                        </div>
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>First name</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Last name</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (stepIndex === 1) {
            return (
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Document type</label>
                        <select
                            className={inputClass}
                            name="documentType"
                            value={formData.documentType}
                            onChange={handleChange}>
                            {options.documentType.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}

                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>ID number</label>
                        <input
                            type="text"
                            name="idNumber"
                            placeholder="ID number"
                            value={formData.idNumber || ""}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Document upload</label>
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border hover:bg-blue-100 hover:cursor-pointer border-dashed border-blue-200 bg-blue-50 p-4">
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleUpload(e, "documentType")}
                                className="text-sm"
                            />
                            <div className="text-xs text-gray-600">
                                {uploading
                                    ? "Uploading document..."
                                    : formData.documentType
                                    ? "Document uploaded successfully"
                                    : "Upload a clear image or PDF of your ID"}
                            </div>
                            {formData.documentType && (
                                <a
                                    href={formData.documentType}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-semibold text-blue-900 underline">
                                    View uploaded document
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (stepIndex === 2) {
            return (
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Gender</label>
                        <select
                            className={inputClass}
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}>
                            {options.gender.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Age</label>
                        <input
                            type="text"
                            name="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>
                </div>
            );
        }


        if (stepIndex === 3) {
            return (
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Current Address</label>
                        <input
                            type="text"
                            className={inputClass}
                            name="homeAddress"
                            placeholder="Your own current home address"
                            value={formData.homeAddress || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>City</label>
                        <input
                            type="text"
                            className={inputClass}
                            name="city"
                            placeholder="City"
                            value={formData.city || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>State</label>
                        <input
                            type="text"
                            className={inputClass}
                            name="state"
                            placeholder="State"
                            value={formData.state || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Country</label>
                        <input
                            type="text"
                            className={inputClass}
                            name="country"
                            placeholder="Country"
                            value={formData.country || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Zip code</label>
                        <input
                            type="text"
                            className={inputClass}
                            name="zipCode"
                            placeholder="Zip code"
                            value={formData.zipCode || ""}
                            onChange={handleChange}
                        />
                    </div>

                </div>
            );
        }
    
    };

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <ToastContainer />
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-950">
                                Complete Your Profile
                            </h1>
                            <p className="mt-2 text-sm text-blue-950/70">
                                Provide accurate details to help us verify your profile.
                            </p>
                        </div>
                        <Link
                            href={
                                role === "landlord"
                                    ? "/landlordDashboard"
                                    : "/tenantDashboard"
                            }
                            className="inline-flex items-center justify-center rounded-xl border border-blue-900 px-4 py-2 text-sm font-semibold text-blue-900">
                            Back to dashboard
                        </Link>
                    </div>
                </div>

                <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-sm font-semibold text-blue-950">
                            <span>
                                Step {stepIndex + 1} of {steps.length}
                            </span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-blue-100">
                            <div
                                className="h-2 rounded-full bg-blue-900 transition-all"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="grid gap-3 md:grid-cols-5">
                            {steps.map((step, index) => (
                    <button
                        type="button"
                        key={step.key}
                        onClick={() => setStepIndex(index)}
                        className={`rounded-lg border px-3 py-2 text-xs cursor-pointer hover:rounded-sm hover:scale-105 font-semibold ${
                            index === stepIndex
                                ? "border-blue-900 bg-blue-50 text-blue-900"
                                : "border-gray-200 text-gray-500"
                        }`}
                    >
                        {step.title}
                    </button>
))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-xl bg-white p-10 text-gray-600 shadow-md">
                        Loading profile...
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-xl bg-white p-6 shadow-md">
                            <h2 className="text-xl font-bold text-blue-950">
                                {steps[stepIndex].title}
                            </h2>
                            <div className="mt-4">{renderStep()}</div>
                        </div>

                        <div className="flex flex-wrap justify-between gap-4">
                            <button
                                type="button"
                                disabled={stepIndex === 0}
                                onClick={() =>
                                    setStepIndex((prev) =>
                                        Math.max(prev - 1, 0),
                                    )
                                }
                                className="rounded-xl cursor-pointer border border-blue-900 transition-all duration-200 hover:rounded-sm hover:scale-110 px-6 py-3 text-sm font-semibold text-blue-900 disabled:border-gray-300 disabled:text-gray-400">
                                Back
                            </button>

                            {stepIndex < steps.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStepIndex((prev) => prev + 1);
                                
                                    }}
                                    disabled={saving || uploading}
                                    className="rounded-xl bg-blue-900 cursor-pointer hover:rounded-sm hover:scale-110 hover:bg-blue-700 transition-all duration-200 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                    Next
                            </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={saving || uploading}
                                    className="rounded-xl bg-blue-900 cursor-pointer hover:rounded-sm hover:scale-110 hover:bg-blue-700 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Submit"}
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LandlordProfilePage;