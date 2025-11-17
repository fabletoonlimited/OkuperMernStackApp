import React from "react";
import TenantDashboardSidebar from "../../components/tenantDashboardSidebar/index.js";
import TenantDashboardCard from "../../components/tenantDashboardCard/index.js";
import TenantDashboardFooter  from "../../components/landlordDashboardFooter/index.js";


function tenantDashboard() {   
    return (
        <>
            <div className="tenantDashboardContainer flex">
                 <TenantDashboardSidebar />

                <div>
                    <div className="tenantDashboardWelcomeMessage mt-8 p-6 bg-white" 
                    style={{
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        minWidth: "1500px"
                        }}>
                        <h1 className="font-bold md:text-5xl text-2xl pl-7">Welcome, tenant!</h1>
                        <p className="mt-2 md:text-xl pl-7 md:w-auto w-70 text-justify">
                            We are thrilled that you have chosen Okuper to rent your
                            next property.
                        </p>

                    </div>
                    <div className="tenantDashboardNextSteps md:mt-8 p-7   ">
                        <h3 className="font-medium md:text-4xl text-2xl pl-7">Your next steps</h3>
                            <p className="mt-2 md:text-xl pl-7 md:w-auto w-70 text-justify">
                                In other to complete your profile and
                                listing,there are a few things left to do.
                            </p>
                    </div>
                </div>
                    
            </div>
            <TenantDashboardCard />
            <TenantDashboardFooter /> 
        </>
    );
}

// landlordDashboard.getLayout = function getLayout(page) {
//     return {page};
//   };

    export default tenantDashboard;
        
        
        
        
        
        
    
    