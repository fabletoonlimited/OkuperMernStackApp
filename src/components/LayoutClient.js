"use client";

import { usePathname } from "next/navigation";
import Nav from "./nav";
import Footer from "./footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LayoutClient({ children }) {
    const pathname = usePathname();

    const noLayoutRoutes = [
        "/landlordDashboard",
        "/tenantDashboard",
        "/landlordDashboardInbox",
        "/propertyListingLanding",
        "/propertyListingUploadForm",
        "/propertyCardExpanded",
        "/verification",
        "/contact",
        "/savedHomes",
        "/landlordDashboardComplete",
    ];

    const shouldHideLayout = noLayoutRoutes.includes(pathname);

    return (
        <>
            {!shouldHideLayout && <Nav />}

            {children}

            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
            />

            {!shouldHideLayout && <Footer />}
        </>
    );
}
