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
const router = useRouter();
useEffect(() => {
    const checkAuth = async () => {
        try {
            const res = await fetch("/api/auth/me", { credentials: "include" });
            setIsAuthenticated(res.ok);
        } catch {
            setIsAuthenticated(false);
        }
    };
    checkAuth();
}, []);
    
    const goToContact = () => {
        router.push("/contact");
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
            <div className="absolute bottom-45 left-[33%] transform -translate-x-1/2 z-30 hidden md:block">
                <img
                    src={BASE_URL + "/bannerboy_eygggt"}
                    alt="bannerModel"
                    className="h-[537px] w-auto object-contain"
                />
            </div>

            <div className="relative w-full min-h-[470px] md:h-[480px] ">
                {/* Background Image */}
                <Image
                    src={BASE_URL + "/Banner_2_o4ie3w"}
                    alt="Banner1"
                    fill
                    className="object-cover"
                    priority
                />

                {/* Support Icon */}
                <div className="absolute top-10 right-4 md:top-10 md:right-10 h-12 w-12 md:h-16 md:w-16 bg-amber-600 rounded-full animate-bounce z-30 flex items-center justify-center">
                    <button onClick={() => router.push("/contact")}>
                        <FontAwesomeIcon
                            icon={faHeadset}
                            className="text-white text-2xl md:text-4xl"
                            style={{ cursor: "pointer" }}
                        />
                    </button>
                </div>

                {/* Content Over Banner */}
                <div className="relative md:absolute md:inset-0 z-20 flex flex-col items-center md:items-start justify-center px-8 md:px-4 py-8 md:py-0 md:ml-[60%] text-white md:mt-[-80px] text-center md:text-left">
                    <Image
                        className="self-start mb-2 md:mb-0"
                        src={Icon}
                        alt="houseIcon"
                        width={60}
                        height={65}
                    />
                    <h1 className="text-4xl md:text-4xl font-light mt-4 md:mt-8 md:justify-items-start justify-items-start">
                        We got you covered
                    </h1>
                    <h3 className="text-sm md:text-lg pr-2 md:pr-10 font-light mt-4 px-4 md:px-0 text-justify md:text-justify">
                        The Nigerian rental market has become tainted by the
                        greed of middlemen, who often charge exorbitant fees.
                    </h3>

                    {/* Buttons */}
                    <div className="mt-15 md:mt-6 flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                        <button
                            className="bg-blue-950 flex text-white px-22 md:px-8 gap-2 pt-3 md:py-3
rounded-md text-md md:text-base hover:bg-blue-300 hover:text-[#0E1D48] transition"
                            onClick={
                                isAuthenticated === true
                                    ? goTopropertyListing
                                    : goToSignUp
                            }>
                            <Image
                                className="self-start mb-2 md:mb-0"
                                src={homeIcon}
                                alt="houseIcon"
                                width={25}
                                height={25}
                            />
                            Got a vacant home?
                        </button>

                        <Link href="/rent">
                            <button className="bg-white text-blue-950 flex gap-3 md:px-8 px-22 pt-3 md:py-3 rounded-md text-md md:text-base hover:bg-amber-200 transition">
                                <Image
                                    className="self-start mb-2 md:mb-0"
                                    src={userIcon}
                                    alt="houseIcon"
                                    width={22}
                                    height={24}
                                />
                                Looking for a home?
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Boxes */}
            <div
                className="bannerBoxes relative z-30 top-30 md:row md:gap-6 md:px-30 px-12 mb-30
py-0 h-65 flex flex-row md:top-0 gap-8 mt-[-80px] md:mt-[-80px] pb-3
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
                        className="w-full md:max-w-[280px] h-250px md:h-[250px] bg-sky-100
rounded-xl px-10 md:px-5.5 py-10 md:py-6 pt-10 shadow-md flex-shrink-0 hover:bg-amber-200 transition"
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
