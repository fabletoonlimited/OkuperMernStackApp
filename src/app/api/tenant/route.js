import express from "express";
import {authenticateToken} from "./authMiddleware.js";
import { signupTenant, loginTenant, getTenant, updateTenant, deleteTenant, errorPage } from "../controllers/tenant.controller.js";

const route = express.Router();

// Example route to authenticate Tenants
route.post('/signup', signupTenant);
route.post('/login', loginTenant);


route.get('/allTenant', authenticateToken, getTenant);
route.put('/:id', authenticateToken, updateTenant);
route.delete('/:id', authenticateToken, deleteTenant);

//Protected Route
route.get('/:id', authenticateToken, (req, res) => {
res.status(200).json({ message: 'Welcome to the Tenant Dashboard' })});

// Error handling route
route.use(errorPage);

export default route;