import React from 'react'
import LandlordDashboardSidebar from "../../components/landlordDashboardSidebar";
import LandlordDashboardFooter from "../../components/landlordDashboardFooter";

const verication = () => {
  return (
      <div>
          <LandlordDashboardSidebar  />
          <div className="bg-white shadow-md p-10 rounded-md mb-6 ">
              <h3 className="text-5xl font-bold text-blue-950">
                  Dear, Tenant!
              </h3>
              <h3 className="text-2xl font-semibold mt-5 text-blue-900">
                  We are thrilled that you have chosen to get your next property
                  with Okuper.
              </h3>
          </div>
          <div className="bg-white shadow-md rounded-md">
              <div className=" mb-3 flex ml p-10">
                  <div>
                      <p className="mt-5 text-black text-2xl font-semibold">
                          Profile picture:
                      </p>
                  </div>
                  <div className="ml-16">
                      <img src="" alt="" className="w-42 h-20" />
                  </div>
              </div>
              <div className=" mb-6 flex p-10">
                  <div>
                      <p className="mt-5 text-black text-2xl font-semibold">
                          Full name:
                      </p>
                  </div>
                  <div className="ml-16">
                      <input placeholder="" className="w-full h-16 border-2 border-2xl  " />
                  </div>
              </div>
               <LandlordDashboardFooter/>
          </div>
      </div>
  );
}

export default verication