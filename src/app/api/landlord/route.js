import express from "express";
import {authenticateToken} from "./authMiddleware.js";
import { signupLandlord, loginLandlord, getLandlord, updateLandlord, deleteLandlord, errorPage } from "../controllers/landlord.controller.js";

const route = express.Router();

// Example route to authenticate Landlords
route.post('/signup', signupLandlord);
route.post('/login', loginLandlord);


route.get('/allTenant', authenticateToken, getLandlord);
route.put('/:id', authenticateToken, updateLandlord);
route.delete('/:id', authenticateToken, deleteLandlord);

//Protected Route
route.get('/:id', authenticateToken, (req, res) => {
res.status(200).json({ message: 'Welcome to the Landlord Dashboard' })});

// Error handling route
route.use(errorPage);

export default route;