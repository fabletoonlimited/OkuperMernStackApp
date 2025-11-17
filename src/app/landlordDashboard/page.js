import React from "react";
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar/index.js";
import LandlordDashboardCard from "../../components/landlordDashboardCard/index.js";
import LandlordDashboardFooter  from "../../components/landlordDashboardFooter/index.js";


function landlordDashboard() {   
    return (
        <>
           

            <div className="landlordDashboardContainer flex">
                 <LandlordDashboardSidebar />

                <div>
                    <div className="landlordDashboardWelcomeMessage mt-8 p-6 bg-white" 
                    style={{
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        minWidth: "1500px"
                        }}>
                        <h1 className="font-bold md:text-5xl text-2xl pl-7">Welcome,Landlord!</h1>
                        <p className="mt-2 md:text-xl pl-7 md:w-auto w-70 text-justify">
                            We are thrilled that you have chosen to list your
                            property with Okuper.
                        </p>

                    </div>
                    <div className="landlordDashboardNextSteps md:mt-8 p-7   ">
                        <h3 className="font-medium md:text-4xl text-2xl pl-7">Your next steps</h3>
                            <p className="mt-2 md:text-xl pl-7 md:w-auto w-70 text-justify">
                                In other to complete your profile and
                                listing,there are a few things left to do.
                            </p>
                    </div>
                </div>
                    
            </div>
                   <LandlordDashboardCard />
                   <LandlordDashboardFooter /> 
                


                
                
                
            
           
          
              
               
            
                      
                      

            

        </>
    );
}

// landlordDashboard.getLayout = function getLayout(page) {
//     return {page};
//   };

    export default landlordDashboard;
        
        
        
        
        
        
    
    