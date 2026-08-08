import crypto from "crypto";
import Payment from "@/app/api/models/paymentModel";
import User from "@/app/api/models/userModel"


export const initializePayment = async ({
  email, 
  amount, 
  currency,  
  isSplitPayment,
  splitPaymentReference,
  property,
  user 
}) => {

  const reference = crypto.randomUUID();

  if (!email || !amount || !currency || !user) 
    {throw new Error("All fields are required")}

  if (isSplitPayment && !splitPaymentReference) 
    {throw new Error("Split payment reference is required")}

  // verify user exists
  const currentUser = await User.findById(user);
    if (!currentUser) {
    throw new Error("User not found");
  }

  const normalizedEmail = email.trim().toLowerCase();

  //Calculate total amount for Xpress
  const serviceCharge = amount * 0.03;
  const legalFee = amount * 0.07;
  const finalPaidAmount = amount + legalFee + serviceCharge;

  // Initialize payment with Xpress
  const response = await fetch(
    `${process.env.NEXT_XPRESS_URL}/Payments/Initialize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_XPRESS_PUBLIC_KEY}`,
      },
      body: JSON.stringify({
        reference,
        email: normalizedEmail,
        amount: finalPaidAmount,
        currency,
        property
      }),
    }
  );

  if (!response.ok) {throw new Error("Payment initialization failed")}

  const result = await response.json();
  if (!result.status) {
  throw new Error(result.message || "Payment initialization failed");
}


  let payment;
  
  if (currentUser.role === "Tenant") {   
    payment = await Payment.create({
    reference, 
    email: normalizedEmail, 
    amount, 
    currency,  
    legalFee,
    serviceCharge,
    finalPaidAmount,
    isSplitPayment, 
    splitPaymentReference, 
    property,
    user
    });
  } else {
    payment = await Payment.create({
    reference, 
    email: normalizedEmail, 
    amount, 
    currency,  
    property,
    user
  });
  }
  return {
    status: result.status,
    transactionId: payment.transactionId,
    amount: payment.finalPaidAmount || payment.amount,     
    result,
  };
};

// Verify Payment
export const verifyPayment = async (reference) => {
  const response = await fetch(
    `${process.env.NEXT_XPRESS_URL}/Payments/VerifyPayment/${reference}`,
     {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_XPRESS_PUBLIC_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Payment verification failed");
  }

  const result = await response.json();

  if(result.status === "Successful") {

  // Update payment after successful verification
  await Payment.findOneAndUpdate(
    { reference },
    {
      status: "Successful",
      transactionId: result.transactionId
    },
    { new: true }
  )};

  return result;
};