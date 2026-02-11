import express from "express";
import {authenticateToken} from "./authMiddleware.js";
import { createAdmin, loginAdmin, getAdmin, errorPage } from "../controllers/admin.controller.js";

const route = express.Router();

// Example route to authenticate Admins
route.post('/signup', createAdmin);
route.post('/login', loginAdmin);

//Protected Route
route.get("/getAdmin", authenticateToken, getAdmin)

route.get('/:id', authenticateToken, (req, res) => {
res.status(200).json({ message: 'Welcome to the Admin Dashboard' })});

// Error handling route
route.get("/404", errorPage);

export default route;