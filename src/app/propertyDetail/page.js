import React from "react";

const disputes = [
    {
        id: "DKDen - 1234",
        resident: "April Naomi",
        complaint: "Sink wasn't installed",
        rating: 5,
    },
    {
        id: "DKDen - 1234",
        resident: "April Naomi",
        complaint: "Sink wasn't installed",
        rating: 3,
    },
    {
        id: "DKDen - 1234",
        resident: "April Naomi",
        complaint: "Sink wasn't installed",
        rating: 4,
    },
];

const transactions = [
    {
        property: "Greenwood 1",
        status: "Rented",
        listed: "13 Jan 2024",
        date: "13 Jun 2024",
        amount: "₦1,000,000",
        code: "SLR-102",
    },
];

function Badge({ children, color }) {
    const colors = {
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600",
        blue: "bg-blue-100 text-blue-600",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
            {children}
        </span>
    );
}

function Sidebar() {
    return (
        <div className="w-72 bg-gray-100 p-6 border-r min-h-screen">
            <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 mb-2"></div>
                <p className="text-sm font-semibold">SLR-102</p>
                <p className="text-xs text-gray-500">LISTED ON: AUG 8 2025</p>
            </div>

            <button className="w-full bg-blue-900 text-white py-2 rounded mb-6">
                ACTION
            </button>

            <div>
                <h3 className="font-semibold text-sm mb-2 text-black">Primary Details</h3>

                <p className="text-xs text-gray-500">Primary Phone:</p>
                <p className="text-sm mb-2">+234 000 000 000</p>

                <p className="text-xs text-gray-600">Primary Email:</p>
                <p className="text-sm mb-4">owner@email.com</p>

                <p className="text-xs text-gray-600">Status:</p>
                <div className="flex gap-2 mt-1">
                    <Badge color="red">Vacant</Badge>
                    <Badge color="green">Sold</Badge>
                    <Badge color="blue">Rented</Badge>
                </div>

                <p className="text-xs text-gray-600 mt-4">Reports</p>
                <p className="text-sm">0</p>
            </div>
        </div>
    );
}

function Gallery() {
    return (
        <div className="grid grid-cols-5 gap-3">
            {/* Left Large Image */}
            <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                className="col-span-3 rounded-lg object-cover h-80 w-full"
            />

            {/* Right Images */}
            <div className="col-span-2 grid grid-cols-2 gap-3 h-80">
                <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                    className="rounded-lg w-full h-full object-cover"
                />
                <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                    className="rounded-lg w-full h-full object-cover"
                />
                <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                    className="rounded-lg w-full h-full object-cover"
                />
                <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                    className="rounded-lg w-full h-full object-cover"
                />
            </div>
        </div>
    );
}

function Disputes() {
    return (
        <div>
        <h2 className="font-semibold mb-4 text-2xl">Disputes</h2>
        <div className="bg-white rounded-lg p-4 mt-6 shadow-sm">
            

            {disputes.map((d, i) => (
                <div
                    key={i}
                    className="grid grid-cols-4 items-center text-sm py-3 border-b last:border-0">
                    <span>{d.id}</span>
                    <span>{d.resident}</span>
                    <span className="text-gray-500">{d.complaint}</span>

                    <span className="text-yellow-500">
                        {"★".repeat(d.rating)}
                        {"☆".repeat(5 - d.rating)}
                    </span>
                </div>
            ))}
            </div>
        </div>
    );
}

function Transactions() {
    return (
        <div className="bg-white rounded-lg p-4 mt-6 shadow-sm">
            <h2 className="font-semibold mb-4">Transactions</h2>

            {transactions.map((t, i) => (
                <div
                    key={i}
                    className="grid grid-cols-6 items-center text-sm bg-gray-50 p-3 rounded-lg">
                    <span>{t.property}</span>
                    <Badge color="green">{t.status}</Badge>
                    <span>{t.listed}</span>
                    <span>{t.date}</span>
                    <span className="font-medium">{t.amount}</span>
                    <span>{t.code}</span>
                </div>
            ))}
        </div>
    );
}

export default function PropertyDetailsPage() {
    return (
        <div className="flex bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="flex-1 p-8">
                {/* Owner Info */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Details of</p>
                        <p className="font-semibold">Owner</p>
                        <p className="text-sm text-gray-600">Oluseun Oluto</p>
                        <p className="text-xs text-gray-400">
                            oluto.oluseun@gmail.com
                        </p>
                    </div>

                    <div className="text-right text-sm text-gray-500">
                        <p>📍 84, Ikate road, Lekki, Lagos</p>
                    </div>
                </div>

                {/* Gallery */}
                <Gallery />

                {/* Property Info */}
                <div className="mt-4">
                    <h1 className="text-xl font-semibold">
                        4 Bedroom Flat with BQ
                    </h1>
                    <p className="text-gray-500">For Rent</p>
                    <p className="text-2xl font-bold mt-1">₦5,500,000 / yr</p>

                    <div className="flex gap-4 mt-4">
                        <button className="border px-4 py-2 rounded">
                            🏠 Bungalow building
                        </button>
                        <button className="border px-4 py-2 rounded">
                            3 Bed | 2 Toilet
                        </button>
                    </div>
                </div>

                {/* Disputes */}
                <Disputes />

                {/* Transactions */}
                <Transactions />
            </div>
        </div>
    );
}
