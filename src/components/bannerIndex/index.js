import Image from "next/image";
import Banner1 from "./Banner_2.png";
import Icon from "../../../public/houseIcon.png";
import homeIcon from "../../../public/Home_Icon.png";
import userIcon from "../../../public/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadset, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";


function Banner() {

const [isAuthenticated, setIsAuthenticated] = useState(false);
const [loading, setLoading] = useState(false);
const [userRole, setUserRole] = useState("");


const router = useRouter();

 useEffect(() => {
    const checkAuth = async () => {
        setLoading(true);
        
        try {
            const res = await fetch("/api/user/me", {
            credentials: "include",
            });

        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUserRole(data.role || null); 
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (err){
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
    
    const goToContact = () => {
        router.push("/contact");
    };
    const goToRent = () => {
        router.push("/rent");
    };
    const goToSignUp = () => {
        router.push("/signUpLanding");
    };
    const goTopropertyListing = () => {
        router.push("/propertyListingLanding");
    };

    const NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "dfdzbuk0c";
    const BASE_URL = `https://res.cloudinary.com/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

    return (
        <div className="relative w-full md:bg-transparent bg-white px-10 md:px-0 mb-10 md:mb-8 z-10">
            {/* Model Image */}
            <div className="absolute bottom-45 left-[33%] z-30 hidden md:block animate-slideXTenant hover:scale-105 duration-300 transition">
                <img
                    src={BASE_URL + "/bannerboy_eygggt"}
                    alt="bannerModelTenant"
                    className="h-[537px] w-auto object-contain"
                />
            </div>
            
            {/* Model Image Mobile */}
            <div className="absolute bottom-44 left-[50%] z-30 md:hidden md:animate-none hover:scale-105 duration-300 transition">
                <img
                    src={BASE_URL + "/bannerboy_eygggt"}
                    alt="bannerModelTenant"
                    className="h-[300px] w-auto object-contain"
                />
            </div>

            {/* Model Landlord */}
            <div className="absolute -bottom-105 left-[33%] z-30 hidden md:block animate-slideXLandlord hover:scale-105 duration-300 transition">
                <img
                    src={BASE_URL + "/modelLandlord_jmsizc"}
                    alt="bannerModelLandlord"
                    className="h-[1800px] w-auto object-contain"
                />
            </div>

            <div className="relative w-full min-h-[470px] md:h-[480px] animate-fadeIn">
                {/* Blue Background */}
                <Image
                    src={BASE_URL + "/Banner_2_o4ie3w"}
                    alt="Banner1"
                    fill
                    className="object-cover"
                    priority
                />

                <div>
                <img 
                    src={BASE_URL + "/Banner_2_o4ie3w"}
                    alt="Banner2"
                    className="object-cover w-full h-[300px] md:hidden"
                />
            </div>

                {/* Support Icon */}
                <div className="hover:scale-95 transition absolute top-10 right-4 md:top-10 md:right-10 h-12 w-12 md:h-16 md:w-16 bg-amber-600 rounded-full animate-bounce hover:animate-none z-30 flex items-center justify-center">
                    <button onClick={() => router.push("/contact")}>
                        <FontAwesomeIcon
                            icon={faHeadset}
                            className="text-white text-2xl md:text-4xl"
                            style={{ cursor: "pointer" }}
                        />
                    </button>
                </div>

                {/* Content Over Banner */}
                <div className="relative md:absolute md:inset-0 z-20 flex flex-col items-center md:items-start justify-center px-8 md:px-4 py-8 md:py-0 md:ml-[60%] text-white md:mt-[-80px] -mt-15 text-center md:text-left">
                    <Image
                        className="self-start mb-0 md:mb-0 -mt-47 md:-mt-0"
                        src={Icon}
                        alt="houseIcon"
                        width={60}
                        height={65}
                    />
                    <div className="flex flex-col gap-4">
                        <h1 className="text-4xl md:text-4xl font-light mt-4 md:mt-8 md:justify-items-start justify-items-start tanantText">
                        We got you covered
                    </h1>
                    <h3 className="text-sm md:text-lg pr-2 md:pr-10 font-light mt-4 px-4 md:px-0 text-justify md:text-justify">
                        The Nigerian rental market has become tainted by the
                        greed of middlemen, who often charge exorbitant fees.
                    </h3>

                    </div> 

                    {/* Buttons */}
                    <div className="mt-15 md:mt-6 flex flex-col md:flex-row gap-5 md:gap-5 w-full md:w-auto">
                        
                        <button className="bg-blue-950 hover:scale-105 transition flex text-white hover:rounded-full px-4 md:px-8 gap-2 pt-3 md:py-3 text-md md:text-base hover:bg-blue-300 hover:text-[#0E1D48]"
                            onClick={() =>
                                isAuthenticated
                                    ? goTopropertyListing()
                                    : goToSignUp()
                            }
                            style={{ cursor: "pointer"}}
                        >
                            <Image
                                className="self-start mb-2 md:mb-0"
                                src={homeIcon}
                                alt="houseIcon"
                                width={25}
                                height={25}
                            />
                            Got a vacant home?
                        </button>

                      
                        <button className="hover:scale-105 transition bg-white text-blue-950 hover:rounded-full flex gap-3 md:px-8 px-4 pt-3 md:py-3 text-md md:text-base hover:bg-amber-200 mb-25 md:mb-0"
                            onClick={goToRent}
                            style={{ cursor: "pointer" }}
                        >
                                
                            <Image
                                className="self-start mb-2 md:mb-0"
                                src={userIcon}
                                alt="houseIcon"
                                width={20}
                                height={22}
                            />
                            
                            Looking for a home?

                        </button>
                        
                    </div>
                </div>
            </div>

            {/* Feature Boxes */}
            <div className="bannerBoxes relative z-30 top-30 md:row md:gap-6 md:px-30 px-12 mb-30 py-0 h-65 flex flex-row md:top-0 gap-8 mt-[-80px] md:mt-[-80px] pb-3
                md:overflow-hidden overflow-x-auto max-w-auto w-full md:w-auto"
                style={{
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE & Edge
                }}>
                {[
                    "Background Check required for home owners and tenants.",
                    "Property ratings by tenants and flagging of suspicious accounts",
                    "Tenants NIN identity, proof, financial record and occupation.",
                    "All communications securely happens within the platform.",
                ].map((text, index) => (
                    <div
                        key={index}
                        className="hover:scale-95 transition w-full md:max-w-[280px] h-250px md:h-[250px] bg-sky-100
                            rounded-xl px-10 md:px-5.5 py-10 md:py-6 pt-10 shadow-md flex-shrink-0 hover:bg-amber-200"
                        style={{ cursor: "pointer" }}>
                        <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="text-[#0E1D48] text-5xl md:text-3xl mb-2"
                        />
                        <p className="font-semibold text-2xl md:text-md text-left md:text-left">
                            {text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Banner;
