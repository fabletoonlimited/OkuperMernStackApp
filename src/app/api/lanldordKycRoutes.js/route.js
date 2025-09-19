import express from 'express';
import { submitLandlordKyc, getLandlordKyc } from '@/app/api/controllers/landlordKycController.js';
import {authenticateLandlord} from '@/app/api/middlewares/authMiddleware.js';
import upload from '@/app/api/middlewares/multer.js';

const route = express.Router();

const billUploads = upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'proofOfAddress', maxCount: 1 },
]);

route.post('/submit', authenticateLandlord, submitLandlordKyc);
route.get('/:id', authenticateLandlord, getLandlordKyc);

export default router;