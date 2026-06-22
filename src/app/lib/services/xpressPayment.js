import Payment from "@/app/api/models/paymentModel";
import User from "@/app/api/models/userModel"


export const initializePayment = async (data) => {
  const { reference, email, amount, currency, status, isSplitpayment, splitPaymentReference, user } = data;

  if (!reference || !email || !amount || !currency || !status || !user) 
    {throw new Error("All fields are required")}

  if (isSplitpayment && !splitPaymentReference) 
    {throw new Error("Split payment reference is required")}

  // Prevent duplicate payments
  const existingPayment = await Payment.findOne({ reference });

  if (existingPayment) 
    {throw new Error("Payment already exists")}

  const normalizedEmail = email.trim().toLowerCase();

  //Calculate total amount for Xpress
  const serviceCharge = amount * 0.05;
  const finalPaidAmount = amount = serviceCharge;

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
        data,
        amount: finalPaidAmount
      }),
    }
  );

  if (!response.ok) {throw new Error("Payment initialization failed")}

  const result = await response.json();

  const currentUser = await User.findById(user);

  let payment;
  
  if (currentUser.role === "Tenant") {   
    payment = await Payment.create({
    reference, 
    email: normalizedEmail, 
    amount, 
    currency, 
    status, 
    isSplitpayment, 
    splitPaymentReference, 
    user
    });
  } else {
    payment = await Payment.create({
    reference, 
    email: normalizedEmail, 
    amount, 
    currency, 
    status, 
    user
  });
  }
  return {
    status: result.status,
    transactionId: payment.transactionId,
    amount: payment.finalPaidAmount,     
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

  // Update payment after successful verification
  await Payment.findOneAndUpdate(
    { reference },
    {
      status: "Successful",
      transactionId: result.transactionId
    },
    { new: true }
  );

  return result;
};