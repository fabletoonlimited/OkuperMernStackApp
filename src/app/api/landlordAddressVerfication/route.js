import express from 'express';
import {createAddress, getAddress, updateAddress, deleteAddress} from '../../api/controllers/landlordAddressVerificationController.js'
import {authenticateLandlord} from '../middlewares/authLandlord.js'
import upload from "../../lib/multer.js";

const route = express.Router();

const utilityUpload = upload.fields(
  {name: "utilityBill", maxCount: 1}
);

route.post("/upload", authenticateLandlord, utilityUpload, createAddress);
route.get("/", authenticateLandlord, getAddress);
route.put("/:id", authenticateLandlord, updateAddress);
route.delete("/:id", authenticateLandlord, deleteAddress);


export default route;