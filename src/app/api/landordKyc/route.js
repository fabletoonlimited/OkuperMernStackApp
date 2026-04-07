import express from 'express';
import { submitLandlordKyc, getLandlordKyc } from '@/app/api/controllers/landlordKycController.js';
import {authenticateLandlord} from '@/app/api/middlewares/landlordMiddleware.js';
import upload from '../../lib/multer.js';

const route = express.Router();

const idUpload = upload.fields(
    { name: 'idDocument', maxCount: 1 }
);

route.post('/submit', authenticateLandlord, idUpload, submitLandlordKyc);
route.get('/:id', authenticateLandlord, getLandlordKyc);

export default route;