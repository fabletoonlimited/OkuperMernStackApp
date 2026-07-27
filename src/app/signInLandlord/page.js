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
            try {
            const res = await fetch("/api/user/me", {
                credentials: "include",
            });

            if (!res.ok) return;

                const user = await res.json();

                if (user.role === "landlord") {
                    router.replace("/landlordDashboard");
                }

                if (user.role === "tenant") {
                    router.replace("/tenantDashboard");
                }

                if (user.role === "admin") {
                    router.replace("/dashboardAdmin");
                }

                if (user.role === "superAdmin") {
                    router.replace("/dashboardSuperAdmin");
                }
            } catch (error) {
                console.error("Auth check error:", error);
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

            setLoading(false);

            router.replace("/landlordDashboard");

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
                        className="bg-blue-950 hover:bg-blue-800 hover:rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 w-full text-xl rounded">
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                {/* RIGHT SIDE - BANNER */}
                    <div className="relative bg-[rgba(0,51,153,1)] rounded-2xl shadow-lg overflow-hidden">
                        {/* Banner Top Section */}
                        <div className={"relative h-40 rounded-2xl shadow-lg bannerBgColor mb-200"}>
                            <div className={"relative p-10 rounded-t-2xl md:w-155 w-50% bg-[rgba(0,51,153,1)] py-2 md:h-20 leading-relaxed bannerBgColor"}>
                                <h2 className="font-medium md:text-4xl text-3xl text-white leading-8 md:leading-12 md:pt-15 pt-20 px-2 md:px-2 text-center md:text-center">
                                    <b>
                                        Rent & Buy your Homes Directly on Okuper
                                    </b>
                                </h2>
                                <p className="absolute text-sm md:font-medium leading-[1.5] mt-5 md:mt-40 md:text-[20px] text-white text-center px-15 md:px-25 md:text-center">
                                    No agents. No hidden fees. Connect directly with
                                    your next home owners on Okuper. Verified people
                                    and real homes.
                                </p>
                            </div>
                        </div>

                        {/* Images Section */}
                        <div className="relative">
                            <img
                                src="/BannerSam.png"
                                alt="Ad Banner Sam"
                                className={"bannerLady md:h-auto h-60 md:w-120 w-120 bottom-[-541px] md:bottom-[-654px]"}
                                style={{ position: "absolute", height: "auto" }}
                            />
                            <img
                                src="/bannerGirl.png"
                                alt="Banner Girl"
                                className={"rounded-b-2xl -mt-2 md:w-150 w-100% md:h-auto h-60"}
                            />
                        </div>
                    </div>
            </div>
        </>
    );
};

export default Page;
