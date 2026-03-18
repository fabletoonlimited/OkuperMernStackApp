"use client"
import React, { useState } from "react";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar/index.js";

const disputes = [
    /* keep your data */
];

const ITEMS_PER_PAGE = 4;

const Page = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(disputes.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = disputes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <>
            <AdminDashboardSidebar />

            <div className="mt-6 p-12">
                <h2 className="font-semibold mb-4 text-2xl">Disputes</h2>

                {/* Table header */}
                <div className="grid grid-cols-4 font-medium text-gray-500 p-3">
                    <span>Dispute No</span>
                    <span>Resident</span>
                    <span>Complaint</span>
                    <span>Rating</span>
                </div>

                {/* Data rows */}
                <div className="rounded-lg p-3">
                    {currentData.map((d, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-4 items-center text-sm py-3 px-3 mb-3 bg-white rounded-lg">
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

                {/* Pagination (BOTTOM CENTER) */}
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        disabled={currentPage === 1}>
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${
                                currentPage === i + 1
                                    ? "bg-black text-white"
                                    : "bg-gray-200"
                            }`}>
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default Page;
