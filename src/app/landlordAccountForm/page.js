"use client"

import React, { useState, useEffect } from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar/index.js";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter/index.js";
import { useRouter } from "next/navigation";
import {toast} from "react-toastify"

export default function BankSearch() {
    const router = useRouter();

    const [accountNo, setAccountNo] = useState("");
    const [banks, setBanks] = useState([]);
    const [filteredBanks, setFilteredBanks] = useState([]);
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedBank, setSelectedBank] = useState("");
    const [landlord, setLandlord] = useState(null);
    const [landlordEmail, setLandlordEmail] = useState(null);

        
    // ✅ get logged in landlord
    useEffect(() => {

        const getMe = async () => {
            try {
                const res = await fetch("/api/user/me", {
                    method: "GET",
                    cache: "no-store",
                });
        
                const data = await res.json();
        
                if (!res.ok) return;
        
                // adjust depending on your response shape
                const email = data?.user?.email || data?.email;
                setLandlordEmail(email || null);
            } catch (err) {
                console.error("Auth me error:", err);
            }
        };
        getMe();
    }, []);
    
    // Landlord
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
            } catch (err) {
                console.error(err);
                toast.error("Landlord fetch error");
            }
        };
        fetchLandlord();
    }, []);

    // Fetch banks

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountNo.trim()) {
        toast.error("Please enter your account number");
        return;
    }

    if (!selectedBank) {
        toast.error("Please select a bank");
        return;
    }

    if (!landlord?._id) {
        toast.error("Landlord not found");
        return;
    }

    try {
        const res = await fetch("/api/accounts/getBanks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                landlord: landlord._id,
                accountNo,
                bank: selectedBank.bankName,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message);
            return;
        }

        toast.success("Bank details saved successfully");

        console.log(data);

        router.push("/landlordDashboard")

    } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
    }
};

    // Fetch banks
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const res = await fetch("/api/accounts/bankDetails");

                const data = await res.json();

                console.log(data);

                if (!res.ok) {
                    setBanks([]);
                    setFilteredBanks([]);
                    return;
                }

                const bankList = Array.isArray(data.data) ? data.data : [];

                setBanks(bankList);
                setFilteredBanks(bankList);

            } catch (err) {
                console.error(err);
                setBanks([]);
                setFilteredBanks([]);
            }
        };

        fetchBanks();
    }, []);

    const handleSearch = (e) => {
    const value = e.target.value;
        setSearch(value);

    const filtered = banks.filter((bank) =>
        bank.bankName.toLowerCase().includes(value.toLowerCase())
    );

        setFilteredBanks(filtered);
        setShowDropdown(true);
    };


    const handleSelectBank = (bank) => {
        setSelectedBank(bank);
        setSearch(bank.bankName);
        setShowDropdown(false);
    };
    
    return (
        <>
            <div className="flex bg-gray-100"> 
                <div className="flex min-h-screen bg-gray-100">
                    <LandlordDashboardSidebar />
                    <div className="flex-1">

                        {/* Top Nav Section*/}
                        <div className="landlordDashboardWelcomeMessage w-screen mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                            <h1 className="font-bold md:text-5xl text-2xl pl-7">
                                Welcome, 
                                {
                                    landlord
                                    ?`${landlord.firstName} ${landlord?.lastName }` 
                                    : "Landlord"
                                }!
                            </h1>
                            <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
                                We are thrilled that you have chosen to list
                                your property with Okuper.
                            </p>
                        </div>

                        {/* Dashboard Section*/}
                        <div className="landlordDashboardNextSteps md:mt-8 md:px-20 px-0">
                            <h3 className="font-medium md:text-4xl text-2xl pl-7">
                                Your next steps
                            </h3>
                            <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
                                Please fill in your bank details to allow us process your property payments.
                            </p>
                        </div>

                        <form 
                            onSubmit={handleSubmit}
                            className="mb-5"
                        >
                            <div className="relative w-full max-w-md ml-27 mt-10">
                                <input 
                                type="text"
                                value={accountNo}
                                onChange={(e) => setAccountNo(e.target.value)}
                                placeholder="Account Number"
                                className="w-full border rounded-lg p-3"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearch}
                                    onFocus={() => setShowDropdown(true)}
                                    placeholder="Search or select bank"
                                    className="w-full border rounded-lg p-3 mt-4"
                                 />
                      
                        
                                <button
                                    type="button"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className={`absolute right-3 bottom-1 -translate-y-1 hover:scale-110 transition-transform ${
                                    showDropdown ? "rotate-180" : ""
                                    }`}
                                >
                                    ▼
                                </button>
                            
                            </div>
                            

                            {showDropdown && (
                            <div className="ml-27 absolute z-50 w-112 mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">

                                {Array.isArray(filteredBanks) && filteredBanks.length > 0 ? (
                                    filteredBanks.map((bank, index) => (
                                        <div
                                        key={`${bank.bankCode}-${index}`}
                                        onClick={() => handleSelectBank(bank)}
                                        className="px-4 py-3 cursor-pointer hover:bg-blue-500 hover:text-white"
                                        >
                                        {bank.bankName}
                                        </div>
                                    ))
                                    ) : (
                                    <div className="px-4 py-3 text-gray-500">
                                        No bank found
                                    </div>
                                )}
                                </div>
                            )}

                         <button
                            type="submit"
                            className={`absolute right-218 bottom-1 bg-blue-900 text-white px-10 py-2 rounded-lg -translate-y-1 hover:scale-110 }`}
                        >
                            Submit
                        </button>
                        </form>
                    </div>
                </div>
            </div>
            <LandlordDashboardFooter />
        </>
    );
}
