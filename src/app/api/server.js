import express from "express";
import tenant from "./tenant/route.js"
import landlord from "../api/landlord/route.js";
import admin from "../api/admin/route.js"
import user from "../api/user/route.js"
import message from "../api/message/route.js"
import landlordAddressVerification from "./landlordAddressVerfication/route.js";
import tenantAddressVerification from "./tenantAddressVerification/route.js";
import otp from "./otp.js/route.js"

import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

//Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {console.log("✅ MongoDB connection successful")})
  .catch(() => console.log("❌ MongoDB connection error:"));

//Middleware
app.use(express.json());
app.use(express.text({ 
  type: ["application/javascript", "text/plain", "text/html", "application/xml"]
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5001", "https://okuper.onrender.app"],
  credentials: true,
  })
);

// Accept raw/plain/text types
app.use(express.text({ 
  type: ["application/javascript", "text/plain", "text/html", "application/xml"]
}));

// Routes completed
app.use('/', index);
app.use('/api/user', user); 
app.use('/api/admin', admin);
app.use('/api/otp', otp);
app.use('/api/landlord', landlord);
app.use('/api/tenant', tenant);
app.use('/api/message', message);

// Routes not completed
app.use('/api/property', property);
app.use('/api/listing', listing);
app.use('/api/landlordKyc', landlordKyc);
app.use('/api/landlordDashboard', landlordDashboard);
app.use('/api/tenantKyc', tenantKyc);
app.use('/api/tenantDashboard', tenantDashboard);
app.use('/api/landlordAddressVerification', landlordAddressVerification);
app.use('/api/tenantAddressVerification', tenantAddressVerification);
app.use('/api/enquiry', enquiry);
app.use('/api/appointment', appointment);
app.use('/api/faq', faq);
app.use('/api/review', review);
app.use('/api/blog', blog);
app.use('/api/subscription', subscription);
app.use('/api/contact', contact);
app.use('/api/newsletter', newsletter);
app.use('/api/testimonial', testimonial);
app.use('/api/feature', feature);
app.use('/api/statistic', statistic);
app.use('/api/amenity', amenity);
app.use('/api/propertyType', propertyType);
app.use('/api/payment', payment);
app.use('/api/transaction', transaction);
app.use('/api/maintenanceRequest', maintenanceRequest);
app.use('/api/leaseAgreement', leaseAgreement);
app.use('/api/notification', notification);
app.use('/api/report', report);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;