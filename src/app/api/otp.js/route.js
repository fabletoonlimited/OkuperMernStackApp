import express from "express"
import { requestOtp } from "../controllers/otpController.js"

const route = express.Router()

route.post("/request-otp", requestOtp);

export default route
