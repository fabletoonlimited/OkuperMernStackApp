import React from "react";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar";

const Page = () => {
    
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminDashboardSidebar />

            {/* Main Content */}
            <div className="flex-1 flex justify-center py-8">
                <div className="w-full max-w-5xl px-4">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-10">
                        Property Dispute / Report Form
                    </h1>

                    <p className="text-xs text-gray-400 mb-10">
                        DISPUTE NO: DKDen - 1234
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-center gap-6">
                            <label className="w-40 text-xs font-semibold text-gray-700">
                                TENANT NAME:
                            </label>
                            <input
                                type="text"
                                placeholder="FULLNAME"
                                className="flex-1 border border-gray-600 rounded px-4 py-2 text-sm outline-none"
                            />
                        </div>

                        <div className="flex items-start gap-6">
                            <label className="w-40 text-xs font-semibold text-gray-700 mt-2">
                                COMPLAINT:
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Message"
                                className="flex-1 border border-gray-600 rounded px-4 py-3 text-sm outline-none resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="w-40 text-xs font-semibold text-gray-700">
                                RATING:
                            </label>
                            <div className="text-black text-lg">★ ★ ★ ★ ☆</div>
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="w-40 text-xs font-semibold text-gray-700">
                                PROPERTY:
                            </label>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <img src="" alt="yoo" />
                                <span>SLR-102</span>
                            </div>
                        </div>

                        <div className="flex justify-center pt-6">
                            <button className="bg-blue-800 text-white px-10 py-2 text-sm rounded">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
