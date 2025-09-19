import express from "express";
import {authenticateToken} from "./authMiddleware.js";
import { signupAdmin, loginAdmin, getAdmin, updateAdmin, deleteAdmin, errorPage } from "../controllers/admin.controller.js";

const route = express.Router();

// Example route to authenticate Admins
route.post('/signup', signupAdmin);
route.post('/login', loginAdmin);


route.get('/allTenant', authenticateToken, getAdmin);
route.put('/:id', authenticateToken, updateAdmin);
route.delete('/:id', authenticateToken, deleteAdmin);

//Protected Route
route.get('/:id', authenticateToken, (req, res) => {
res.status(200).json({ message: 'Welcome to the Admin Dashboard' })});

// Error handling route
route.use(errorPage);

export default route;