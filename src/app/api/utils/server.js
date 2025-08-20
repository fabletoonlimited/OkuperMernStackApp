import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary'

 //require the cloudinary library

 cloudinary.config ({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
   secure: true,
 });

 export async function GET() {
    const result = await cloudinary.search
    .expression('')
    .execute();
    
    return NextResponse.json(result.resources)
 }