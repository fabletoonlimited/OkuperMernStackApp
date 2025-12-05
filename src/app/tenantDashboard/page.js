import React from "react";
import TenantDashboardSidebar from "../../components/tenantDashboardSidebar";
import TenantDashboardCard from "../../components/tenantDashboardCard";
import TenantDashboardFooter from "../../components/tenantDashboardFooter";

function TenantDashboard() {
    return (
        <>
            <div className="tenantDashboardContainer flex">
                {/* Sidebar */}
                <TenantDashboardSidebar />

                {/* Main content */}
                <div className="flex-1">
                    <div
                        className="tenantDashboardWelcomeMessage mt-8 p-6 bg-white"
                        style={{
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}>
                        <h1 className="font-bold md:text-5xl text-2xl pl-7">
                            Welcome, tenant!
                        </h1>
                        <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
                            We are thrilled that you have chosen Okuper to rent
                            your next property.
                        </p>
                    </div>

                    <div className="tenantDashboardNextSteps md:mt-8 p-7">
                        <h3 className="font-medium md:text-4xl text-2xl pl-7">
                            Your next steps
                        </h3>
                        <p className="mt-2 md:text-xl pl-7 md:w-auto text-justify">
                            In order to complete your profile and listing, there
                            are a few things left to do.
                        </p>
                    </div>
                    <div className="md:px-16 px-0">
                        <TenantDashboardCard />
                    </div>
                </div>
            </div>

            <TenantDashboardFooter />
        </>
    );
}

export default TenantDashboard;
