"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

const page = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/user/me", {
        credentials: "include",
      });

      if (res.ok) {
        router.replace("/tenantDashboard");
      }
    };

    checkAuth();
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; 


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
      const response = await fetch("/api/loginTenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();;

      if (!response.ok) {
        toast.error(
          data.message || data.error || "Login failed. Please try again.",
        );
        setLoading(false);
        return;
      }
      toast.success("Login successful! 🎉")


      const redirect = localStorage.getItem("redirectAfterLogin");

        if (redirect) {
          localStorage.removeItem("redirectAfterLogin");
          router.push(redirect);
        } else {
          setTimeout(() => {
            router.push("/tenantDashboard");
          }, 1000);
        }

      } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <h1
        className="font-bold text-4xl"
        style={{ paddingLeft: 45, marginTop: 70 }}
      >
        Sign in
      </h1>

      {/* <ToastContainer position="top-center" autoClose={3000} /> */}

      {/*SignIn Form*/}
      <div className="flex flex-col md:flex-row justify-between items-start gap-10 px-10 mt-10 mb-20">

        {/*Email*/}
        <div className="w-full md:w-1/2 max-w-lg">
          <form onSubmit={handleSignInSubmit}
            className="border border-gray-300 p-8 rounded-lg">

            <p style={{ paddingTop: 20, marginBottom: 30 }}>Email Address</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="border-2 border-gray-300 p-3 rounded w-full"
            />

            {/*Password*/}
            <p style={{ paddingTop: 20, marginBottom: 30 }}>Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border-2 border-gray-300 p-3 rounded w-full"
            />

            <p style={{ paddingTop: 30, marginBottom: 30 }}>
              Forgot password?
              <Link href="/forgotPassword">
                  <span className="ml-2 cursor-pointer text-blue-600 hover:underline">
                  {" "}
                  Click here
                </span>
              </Link>
            </p>

        
          {/*SignIn Btn*/}
            <button
              type="submit"
              disabled={loading}
                className="bg-blue-950 hover:bg-blue-800 hover:rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 w-full text-xl rounded">
              {loading ? "Signing In..." : "Sign In"}
            </button>
        

        </form>


        <div className="pl-0 mt-5">
          Don't have an account?{" "}
          <Link href="/signUpTenant">
            <span className="cursor-pointer hover:text-blue-600">
              Sign Up here
            </span>
          </Link>
        </div>
      </div>

     

 
                {/* RIGHT SIDE - BANNER */}
                    <div className="relative bg-[rgba(0,51,153,1)] rounded-2xl shadow-lg mt-10 md:-mt-22">
                        
                        {/* Banner Top Section */}
                        <div className={"relative h-50 rounded-2xl mb-15 md:mb-22"}>
                            <div className={"relative rounded-t-2xl md:w-155 w-50% py-2 md:h-20 leading-relaxed"}>
                                <h2 className="font-medium md:text-4xl text-3xl text-white leading-10 md:leading-12 md:pt-15 pt-10 px-15 md:px-20 text-center md:text-center">
                                    <b>
                                        Rent, Buy & Lease your Homes Directly on Okuper
                                    </b>
                                </h2>
                                <p className="absolute text-sm md:font-medium leading-[1.2] mt-7 md:mt-7 md:text-[20px] text-white px-15 md:px-20 md:text-center text-center">
                                    No agents. No hidden fees.<br></br>Connect directly with
                                    your next home owners on Okuper. Verified people
                                    and real homes.
                                </p>
                            </div>
                        </div>

                        {/* Images Section */}
                        <div className="relative bottom-0 md:bottom-0 md:-right-40 -right-25">
                            {/* <img
                                src="/BannerSam.png"
                                alt="Ad Banner Sam"
                                className={"BannerHouse md:h-auto h-60 md:w-120 w-120 bottom-[-541px] md:bottom-[0px]"}
                                style={{ position: "absolute", height: "auto" }}
                            /> */}
                            <img
                                src="/bannerGirl.png"
                                alt="Banner Girl"
                                className={"bannerLady rounded-b-2xl md:w-70 w-100% md:h-auto h-60"}
                            />
                        </div>
                    </div>
       {/*End of Banner Section*/}
      </div>
    </>
  );
};

export default page;
