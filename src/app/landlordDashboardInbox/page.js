import React from 'react'
import Link from 'next/link'
import LandlordDashboardSidebar from '../../components/landlordDashboardSidebar/index.js'
import LandlordDashboardFooter from '../../components/landlordDashboardFooter/index.js'

const page = () => {
  return (
      <div>
          <LandlordDashboardSidebar />
          <div className='landlordDashboardInboxContainer'>
            <div className="landlordInbox mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)">
              <h3 className="text-4xl text-blue-800 font-bold">Inbox</h3>
            </div>
        
            <div className="landlordinbox mt-8 p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)">
              <h5 className="text-xl font-semibold"> my messages</h5>
                    <Link href="/">
                        <p>compose</p>
                    </Link>
                  <Link href="/">
                      <button className="cursor-pointer">show profile</button>
                  </Link>
              </div>
          </div>
          <LandlordDashboardFooter />
      </div>
  );
}

export default page
