"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const emptyProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  documentType: "",
  idNumber: "",
  documentImage: "",
  gender: "",
  age: "",
  occupation: "",
  maritalStatus: "",
  spouseName: "",
  numberOfChildren: "",
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
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-sm focus:border-blue-800 focus:outline-none";
const labelClass = "text-sm font-semibold text-blue-950";

const ProfilePage = () => {
  const [formData, setFormData] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [role, setRole] = useState(null);

  const progressPercent = useMemo(() => {
    if (!steps.length) return 0;
    return Math.round(((stepIndex + 1) / steps.length) * 100);
  }, [stepIndex]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/profile", {
          credentials: "include",
        });

        if (!res.ok) {
          toast.error("Failed to load profile");
          return;
        }

        const data = await res.json();
        const profile = data.profile || {};
        setRole(data.role || null);

        setFormData({
          ...emptyProfile,
          ...profile,
          companyAddress: Array.isArray(profile.companyAddress)
            ? profile.companyAddress.join(", ")
            : profile.companyAddress || "",
          numberOfChildren:
            profile.numberOfChildren !== undefined &&
            profile.numberOfChildren !== null
              ? String(profile.numberOfChildren)
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

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const payload = new FormData();
      payload.append("file", file);

      const res = await fetch("/api/profile/upload", {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Upload failed");
        return;
      }

      setFormData((prev) => ({ ...prev, documentImage: data.url }));
      toast.success("Document uploaded");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/profile", {
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
              onChange={handleChange}
            >
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
            <div className="mt-2 flex flex-col gap-3 rounded-lg border border-dashed border-blue-200 bg-blue-50 p-4">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleUpload}
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
                  className="text-xs font-semibold text-blue-900 underline"
                >
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
              onChange={handleChange}
            >
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
              onChange={handleChange}
            >
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
              onChange={handleChange}
            >
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
              onChange={handleChange}
            >
              {options.maritalStatus.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {formData.maritalStatus === "Married" && (
            <>
              <div>
                <label className={labelClass}>Spouse name</label>
                <input
                  className={inputClass}
                  name="spouseName"
                  placeholder="Spouse name"
                  value={formData.spouseName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={labelClass}>Number of children</label>
                <input
                  className={inputClass}
                  name="numberOfChildren"
                  placeholder="Number of children"
                  value={formData.numberOfChildren}
                  onChange={handleChange}
                />
              </div>
            </>
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

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelClass}>Current address</label>
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
      </div>
    );
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
                role === "landlord" ? "/landlordDashboard" : "/tenantDashboard"
              }
              className="inline-flex items-center justify-center rounded-xl border border-blue-900 px-4 py-2 text-sm font-semibold text-blue-900"
            >
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
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
                onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                className="rounded-xl border border-blue-900 px-6 py-3 text-sm font-semibold text-blue-900 disabled:border-gray-300 disabled:text-gray-400"
              >
                Back
              </button>

              {stepIndex < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
                  }
                  className="rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Profile"}
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
