import express from "express";
import {authenticateLandlord} from "../middlewares/landlordMiddleware.js";
import {requestOtp, verifyOtp } from "../controllers/otpController.js";
import {createLandlord, loginLandlord, getLandlord, getAllLandlord, updateLandlord, deleteLandlord} from "../controllers/landlord.controller.js";

const route = express.Router();

// Route to authenticate Landlords
route.post("/request-otp", requestOtp);

route.post('/signup', verifyOtp, createLandlord);
route.post('/login', loginLandlord);

route.get('/landlord', authenticateLandlord, getLandlord);
route.get('/allLandlord', authenticateLandlord, getAllLandlord);
route.put('/:id', authenticateLandlord, updateLandlord);
route.delete('/:id', authenticateLandlord, deleteLandlord);

//Protected Route
route.get('/:id', authenticateLandlord, (req, res) => {
res.status(200).json({ message: 'Welcome to the Landlord Dashboard' })});


export default route;