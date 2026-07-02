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
    occupation: "",
    specifyOccupation: "",
    maritalStatus: "",
    spouseName: "",
    noOfChildren: "",
    religion: "",
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    currentAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    stateOfOrigin: "",
};

const steps = [
    { key: "basic", title: "Basic Info" },
    { key: "identity", title: "Identity" },
    { key: "personal", title: "Personal" },
    { key: "work", title: "Work" },
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
    maritalStatus: [
        { value: "", label: "Select marital status" },
        { value: "Single", label: "Single" },
        { value: "Married", label: "Married" },
        { value: "Divorced", label: "Divorced" },
        { value: "Widowed", label: "Widowed" },
    ],
    religion: [
        { value: "", label: "Select religion" },
        { value: "Christianity", label: "Christianity" },
        { value: "Islam", label: "Islam" },
        { value: "Traditionalist", label: "Traditionalist" },
        { value: "Other", label: "Other" },
    ],
    occupation: [
        { value: "", label: "Select occupation" },
        { value: "selfEmployed", label: "Self employed" },
        { value: "employed", label: "Employed" },
        { value: "govtWorker", label: "Govt worker" },
        { value: "student", label: "Student" },
        { value: "expatriate", label: "Expatriate" },
        { value: "politician", label: "Politician" },
        { value: "clergyman", label: "Clergyman" },
        { value: "imam", label: "Imam" },
        { value: "business", label: "Business" },
        { value: "other", label: "Other" },
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

const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-sm focus:border-blue-800 focus:outline-none";
const labelClass = "text-sm font-semibold text-blue-950";

const ProfilePage = () => {
    
  const router = useRouter();
  
    const [formData, setFormData] = useState(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [role, setRole] = useState(null);
    const [imagePreviews, setImagePreviews] = useState({});

    const progressPercent = useMemo(() => {
        if (!steps.length) return 0;
        return Math.round(((stepIndex + 1) / steps.length) * 100);
    }, [stepIndex]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/tenantProfile", {
                    credentials: "include",
                });

                if (!res.ok) {
                    toast.error("Failed to load profile");
                    return;
                }

                const data = await res.json();
                const profile = data.tenantProfile || {};
                setRole(data.role || null);

                setFormData({
                    ...emptyProfile,
                    ...profile,
                    companyAddress: Array.isArray(profile.companyAddress)
                        ? profile.companyAddress.join(", ")
                        : profile.companyAddress || "",
                    noOfChildren:
                        profile.noOfChildren !== undefined &&
                        profile.noOfChildren !== null
                            ? String(profile.noOfChildren)
                            : "",
                });
            } catch (err) {
                console.error("Profile fetch error:", err);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
    if (formData.maritalStatus !== "Married") {
        setFormData(prev => ({ ...prev, spouseName: "" }));
    }
}, [formData.maritalStatus]);

    const handleUpload = async (e, field) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            const payload = new FormData();
            payload.append("file", file);

            const res = await fetch("/api/tenantProfile/upload", {
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

            toast.success(`${field} uploaded`);
            console.log("Upload Response:", data);
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submit Caled");
        
        if (!formData.firstName || !formData.lastName) {
                toast.error("Please complete required fields");
                return;
            }

        if (stepIndex !== steps.length - 1) return;

        if (!formData.previewPic) {
            toast.error("please upload a diplay picture");
            return;
        }

        if (!formData.currentAddress) {
            toast.error("kindly fill current address");
            return
        }
        if (!formData.stateOfOrigin) {
            toast.error("kindly fill state of origin");
            return
        }

        try {
            setSaving(true);
            const res = await fetch("/api/tenantProfile", {
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
                ? "/landlordDashboardCompleted"
                : "/tenantDashboardCompleted",
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
                                className="text-sm"
                            />

                        
                            <div className="text-xs text-gray-600">
                                {uploading
                                    ? "Uploading document..."
                                    : formData.previewPic
                                      ? "Document uploaded successfully"
                                      : "Upload a clear image or PDF of your ID"}
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
                                className={inputClass}
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Last name</label>
                            <input
                                className={inputClass}
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Email</label>
                            <input
                                className={inputClass}
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input
                                className={inputClass}
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
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
                            className={inputClass}
                            name="idNumber"
                            placeholder="ID number"
                            value={formData.idNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Document upload</label>
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border hover:bg-blue-100 hover:cursor-pointer border-dashed border-blue-200 bg-blue-50 p-4">
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleUpload(e, "documentImage")}
                                className="text-sm"
                            />
                            <div className="text-xs text-gray-600">
                                {uploading
                                    ? "Uploading document..."
                                    : formData.documentImage
                                      ? "Document uploaded successfully"
                                      : "Upload a clear image or PDF of your ID"}
                            </div>
                            {formData.documentImage && (
                                <a
                                    href={formData.documentImage}
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
                            className={inputClass}
                            name="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Occupation</label>
                        <select
                            className={inputClass}
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}>
                            {options.occupation.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Religion</label>
                        <select
                            className={inputClass}
                            name="religion"
                            value={formData.religion}
                            onChange={handleChange}>
                            {options.religion.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Marital status</label>
                        <select
                            className={inputClass}
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleChange}>
                            {options.maritalStatus.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                     {formData.maritalStatus === "Married" ? (
                        <>
                            <div>
                                <label className={labelClass}>
                                    Spouse name
                                </label>
                                <input
                                    className={inputClass}
                                    name="spouseName"
                                    placeholder="Spouse name"
                                    value={formData.spouseName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Number of children
                                </label>
                                <input
                                    className={inputClass}
                                    name="noOfChildren"
                                    placeholder="Number of children"
                                    value={formData.noOfChildren}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className={labelClass}>
                                Number of children
                            </label>
                            <input
                                className={inputClass}
                                name="noOfChildren"
                                placeholder="Number of children"
                                value={formData.noOfChildren}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                </div>
            );
        }
                

        if (stepIndex === 3) {
            return (
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Company name</label>
                        <input
                            className={inputClass}
                            name="companyName"
                            placeholder="Company name"
                            value={formData.companyName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Company phone</label>
                        <input
                            className={inputClass}
                            name="companyPhone"
                            placeholder="Company phone"
                            value={formData.companyPhone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Company email</label>
                        <input
                            className={inputClass}
                            name="companyEmail"
                            placeholder="Company email"
                            value={formData.companyEmail}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Company address</label>
                        <input
                            className={inputClass}
                            name="companyAddress"
                            placeholder="Company address"
                            value={formData.companyAddress}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            );
        }


        if (stepIndex === 4) {
            return (
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Current Address</label>
                        <input
                            className={inputClass}
                            name="currentAddress"
                            placeholder="Current address"
                            value={formData.currentAddress}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>City</label>
                        <input
                            className={inputClass}
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>State</label>
                        <input
                            className={inputClass}
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Country</label>
                        <input
                            className={inputClass}
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Zip code</label>
                        <input
                            className={inputClass}
                            name="zipCode"
                            placeholder="Zip code"
                            value={formData.zipCode}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>State of origin</label>
                        <input
                            className={inputClass}
                            name="stateOfOrigin"
                            placeholder="State of origin"
                            value={formData.stateOfOrigin}
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

export default ProfilePage;