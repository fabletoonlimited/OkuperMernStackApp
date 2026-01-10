import express from 'express';
import {createAddress, getAddress, updateAddress, deleteAddress} from '../../api/controllers/tenantAddressVerificationController.js'
import {authenticateTenant} from '../middlewares/tenantMiddleware.js'
import upload from "../../lib/multer.js";

const route = express.Router();

const utilityUpload = upload.fields(
  {name: "utilityBill", maxCount: 1}
);

route.post("/upload", authenticateTenant, utilityUpload, createAddress);
route.get("/", authenticateTenant, getAddress);
route.put("/:id", authenticateTenant, updateAddress);
route.delete("/:id", authenticateTenant, deleteAddress);

export default route;