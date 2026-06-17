import Payment from "@/app/api/models/paymentModel";

export const initializePayment = async (data) => {
  const { reference, email, amount, status, isSplitpayment, splitPaymentReference, user } = data;

  if (!reference || !email || !amount || !status || !user) 
    {throw new Error("All fields are required")}

  // Prevent duplicate payments
  const existingPayment = await Payment.findOne({ reference });

  if (existingPayment) {throw new Error("Payment already exists")}

  const normalizedEmail = email.trim().toLowerCase();

  // Initialize payment with Xpress
  const response = await fetch(
    `${process.env.NEXT_XPRESS_URL}/Payments/Initialize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_XPRESS_PUBLIC_KEY}`,
      },
      body: JSON.stringify(data),
    }
  );
  // const response = await fetch(
  //   `${process.env.NEXT_XPRESS_URL}/Payments/Initialize`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${process.env.NEXT_XPRESS_SECRET_KEY}`,
  //     },
  //     body: JSON.stringify(data),
  //   }
  // );

  if (!response.ok) {throw new Error("Payment initialization failed")}

  const result = await response.json();

  // Save as Pending (transactionId comes later)
  const newPayment = await Payment
    .create({
      reference,
      email: normalizedEmail,
      amount,
      status: "Pending",
      isSplitpayment,
      splitPaymentReference,
      user,
    });

    

  return {
    status: "Successful",
    transactionId
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
    // {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${process.env.NEXT_XPRESS_SECRET_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    // }
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