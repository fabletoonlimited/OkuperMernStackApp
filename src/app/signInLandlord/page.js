"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Page = () => {
    const router = useRouter();

    // Check auth
    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch("/api/auth/me", {
                credentials: "include",
            });

            if (res.ok) {
                router.replace("/landlordDashboard");
            }
        };
        checkAuth();
    }, [router]);

    // State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignInSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/loginLandlord", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(
                    data.message ||
                        data.error ||
                        "Login failed. Please try again.",
                );
                setLoading(false);
                return;
            }

            toast.success("Login successful! 🎉");
            setTimeout(() => {
                router.push("/landlordDashboard");
            }, 1000);
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="font-bold text-4xl mt-16 ml-10">Sign in</h1>

            <ToastContainer position="top-center" autoClose={3000} />

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 px-10 mt-10 mb-20">
                {/* LEFT SIDE - FORM */}
                <form
                    onSubmit={handleSignInSubmit}
                    className="w-full md:w-1/2 max-w-lg border border-gray-300 p-8 rounded-lg">
                    {/* Email */}
                    <p className="mb-3 mt-4 text-lg">Email Address</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="border-2 border-gray-300 p-3 rounded w-full"
                    />

                    {/* Password */}
                    <p className="mb-3 mt-8 text-lg">Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="border-2 border-gray-300 p-3 rounded w-full"
                    />

                    <p className="mt-6 mb-6">
                        Forgot password?
                        <Link href="/forgotPassword">
                            <span className="ml-2 cursor-pointer text-blue-600 hover:underline">
                                Click here
                            </span>
                        </Link>
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-950 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 w-full text-xl rounded">
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                {/* RIGHT SIDE - BANNER */}
                <div className="w-full md:w-1/2 relative">
                    <div className="relative bg-[rgba(0,51,153,1)] rounded-2xl shadow-lg overflow-hidden">
                        {/* Banner Top Section */}
                        <div className="p-10 text-center">
                            <h2 className="text-white text-3xl md:text-5xl font-semibold leading-snug">
                                Rent & Buy your Homes Directly on Okuper
                            </h2>

                            <p className="mt-6 text-white text-lg md:text-xl leading-relaxed">
                                No agents. No hidden fees. Connect directly with
                                your next home owners on Okuper. Verified people
                                and real homes.
                            </p>
                        </div>

                        {/* Images Section */}
                        <div className="relative">
                            <img
                                src="/BannerSam.png"
                                alt="Ad Banner Sam"
                                className="w-full"
                            />
                            <img
                                src="/bannerGirl.png"
                                alt="Banner Girl"
                                className="absolute -bottom-10 right-0 w-[80%] md:w-[90%] max-w-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
