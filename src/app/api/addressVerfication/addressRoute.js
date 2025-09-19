import express from 'express';
import {createBill, getBill, updateBill, deleteBill, errorPage} from '../../api/controllers/addressVerificationController.js'
import {authenticateToken} from '../middlewares/authLandlord.js'
import upload from "../multer.js";

const route = express.Router();

const postUpload = upload.field(
  {name: "utilityBill", maxCount: 1}
);

route.post("/upload", authenticateToken, postUpload, createBill);

route.get("/", authenticateToken, getBill);
route.put("/:id", authenticateToken, updateBill);
route.delete("/:id", authenticateToken, deleteBill);


export default route;