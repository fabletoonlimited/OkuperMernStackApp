import React from 'react'
import AdminDashboardSidebar from "../../components/adminDashboardSidebar/index.js";

const disputes = [
    {
        id: "DKDen - 1234",
        resident: "April Naomi",
        complaint: "Sink wasn't installed",
        rating: 5,
    },
    {
        id: "DKDen - 1235",
        resident: "John Doe",
        complaint: "Leaking roof",
        rating: 4,
    },
    {
        id: "DKDen - 1236",
        resident: "Jane Smith",
        complaint: "Broken window",
        rating: 3,
    },
    {
        id: "DKDen - 1237",
        resident: "Michael Brown",
        complaint: "Electricity outage",
        rating: 5,
    },
    {
        id: "DKDen - 1238",
        resident: "Emily Johnson",
        complaint: "Heater not working",
        rating: 2,
    },
    {
        id: "DKDen - 1239",
        resident: "David Wilson",
        complaint: "Door handle broken",
        rating: 4,
    },
    {
        id: "DKDen - 1240",
        resident: "Sophia Martinez",
        complaint: "Water pressure too low",
        rating: 3,
    },
    {
        id: "DKDen - 1241",
        resident: "Chris Lee",
        complaint: "Clogged drain",
        rating: 4,
    },
];
const page = () => {
    return (
      <><AdminDashboardSidebar/>
      <div className="mt-6 p-12">
          <h2 className="font-semibold mb-4 text-2xl">Disputes</h2>

          {/* Table header */}
          <div className="grid grid-cols-4 font-medium text-gray-500 p-3 ">
              <span>Dispute No</span>
              <span>Resident</span>
              <span>Complaint</span>
              <span>Rating</span>
          </div>

          {/* Data rows */}
          <div className="rounded-lg p-3">
              {disputes.map((d, i) => (
                  <div
                      key={i}
                      className="grid grid-cols-4 items-center text-sm py-3 px-3 mb-3 last:mb-0 bg-white rounded-lg">
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
        </>
  );
}

export default page