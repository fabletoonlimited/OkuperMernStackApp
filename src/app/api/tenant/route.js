export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { createTenant, loginTenant, getTenant, getAllTenant, updateTenant, deleteTenant } from "../controllers/tenant.controller.js";
import { NextResponse } from "next/server";


// Route to authenticate Landlords

route.post('/signup', verifyOtp, createTenant);
route.post('/login', loginTenant);

route.get('/getTenant', authenticateTenant, getTenant);
route.get('/allTenant', authenticateTenant, getAllTenant);
route.put('/:id', authenticateTenant, updateTenant);
route.delete('/:id', authenticateTenant, deleteTenant);

//Protected Route
route.get('/:id', authenticateTenant, (req, res) => {
res.status(200).json({ message: 'Welcome to the Tenant Dashboard' })});


export default route;