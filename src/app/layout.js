"use client";
// import { headers } from "next/headers";
import { usePathname } from "next/navigation";
import "../style/globals.css"; 
import "./Homepage.css"
import Nav from "../components/nav"
import Footer from "../components/footer"
import { Geist, Geist_Mono } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "Okuper",
//   description: "Connecting verfied tenants to home owners",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const noLayoutRoutes = [
    "/landlordDashboard", 
    "/tenantDashboard", 
    "/landlordDashboardInbox", 
    "/propertyListing",
    "/propertyListingUploadForm", 
    "/propertyCardExpanded"
  ];

  const shouldHideLayout = noLayoutRoutes.includes(pathname);
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!shouldHideLayout && <Nav />}
        {children}
        {!shouldHideLayout && <Footer />}
      </body>
    </html>
  );
}
