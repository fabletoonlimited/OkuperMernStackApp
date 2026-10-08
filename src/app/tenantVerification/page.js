import React from 'react'
import TenantDashboardSidebar from "../../components/tenantDashboardSidebar";
import TenantDashboardFooter from "../../components/tenantDashboardFooter";
import TenantProfilePage from '../tenantProfileForm/page';

const tenantVerification = () => {
  return (
      <div>
          <TenantDashboardSidebar />
          <div className="bg-white shadow-md p-10 rounded-md  ">
              <h3 className="text-5xl font-bold text-blue-950">
                  Dear, Tenant!
              </h3>
              <h3 className="text-2xl font-semibold mt-5 text-blue-900">
                  We are thrilled that you have chosen to get your next property
                  with Okuper.
              </h3>
          </div>

          <TenantProfilePage />
          <TenantDashboardFooter />
      </div>
  );
}

export default tenantVerification