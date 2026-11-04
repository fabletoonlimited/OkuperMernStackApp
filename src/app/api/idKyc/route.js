import { NextResponse } from 'next/server';
import axios from 'axios';

// Ensure your variables are added to your .env.local file
const DOJAH_SECRET_KEY = process.env.DOJAH_SECRET_KEY;
const DOJAH_APP_ID = process.env.DOJAH_APP_ID;
const DOJAH_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://dojah.io' 
  : 'https://dojah.io';

export async function POST(request) {
  try {
    // 1. Parse standard FormData from the client request
    const formData = await request.formData();
    const file = formData.get('nin');
    const userProvidedDetails = formData.get('nin', 'first_name', 'surname', 'gender', 'residentail_address', 'address');

    if (!file) {
      return NextResponse.json({ error: "Missing NIN file upload." }, { status: 400 });
    }

    // 2. Convert the uploaded file to a Base64 Data URI string for Dojah
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // 3. Fire Pre-Hook validation to Dojah's parsing engine
    const response = await axios.post(
      `${DOJAH_BASE_URL}/api/v1/document/analysis/nin`,
      {
        input_type: "url",
        input_value: base64Image
      },
      {
        headers: {
          'Authorization': DOJAH_SECRET_KEY,
          'AppId': DOJAH_APP_ID,
          'Content-Type': 'application/json'
        }
      }
    );

    const parsedData = response.data.entity;

    // 4. PRE-HOOK EVALUATION CRITERIA

    // // Constraint A: Recency Policy (Block if bill is older than 3 months)
    // if (!parsedData.metadata?.is_recent) {
    //   return NextResponse.json({
    //     status: "REJECTED",
    //     reason: "EXPIRED_NIN",
    //     message: "The NIN uploaded is older than 3 months. Please upload a recent statement."
    //   }, { status: 400 });
    // }

    // Constraint B: Fuzzy NIN Match Check
    const extractedUserNIN = parsedData.nin_info?.nin || "";
    const passesFuzzyMatch = fuzzyMatchNIN(userProvidedNin, extractedUserNIN);

    if (!passesFuzzyMatch) {
      return NextResponse.json({
        status: "REJECTED",
        reason: "NIN_MISMATCH",
        message: "The NIN listed on your profile does not match your NIN in the Database."
      }, { status: 400 });
    }

    // 5. SUCCESS STEP: The pre-hook constraints passed successfully.
    // Proceed to register data to your preferred database here (e.g., Prisma, Supabase)
    // await db.user.update({ where: { id: userId }, data: { kycVerified: true } });

    return NextResponse.json({
      status: "SUCCESS",
      message: "NIN verification cleared.",
      provider: parsedData.provider_name
    }, { status: 200 });

  } catch (error) {
    console.error("Dojah API Pre-Hook Failure:", error.response?.data || error.message);
    
    return NextResponse.json({
      status: "REJECTED",
      message: "Unable to process the nin layout. Please ensure the image is bright and legible."
    }, { status: 400 });
  }
}

// Normalized baseline address comparator
function fuzzyMatchAddresses(input, extracted) {
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalize(extracted).includes(normalize(input)) || normalize(input).includes(normalize(extracted));
}