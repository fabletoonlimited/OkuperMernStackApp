import crypto from "crypto";
import Subscription from "@/app/api/models/subscriptionModel";
import User from "@/app/api/models/userModel";

export const initializeSubscription = async ({
  email,
  amount,
  currency,
  plan,
  user,
}) => {


  if (!email || !amount || !currency || !plan || !user) {
    throw new Error("All fields are required");
  }

  // verify user exists
  const currentUser = await User.findById(user);

  if (!currentUser) {
    throw new Error("User not found");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const reference = crypto.randomUUID();

  const exists = await Subscription.findOne({ reference });

  if (exists) {
    throw new Error("Duplicate reference");
  }

  // console.log({
  //   url: `${process.env.NEXT_XPRESS_URL}/Payments/Initialize`,
  //   body: JSON.stringify({
  //     // reference,
  //     Email: normalizedEmail,
  //     Amount: amount.toString(),
  //     Currency: currency,
  //     TransactionId: reference
  //   }),
  // });

  const body = JSON.stringify({
  Email: normalizedEmail,
  Amount: amount.toString(),
  Currency: currency,
  TransactionId: reference,
});

console.log(body);

  const response = await fetch(
    `${process.env.NEXT_XPRESS_URL}/Payments/Initialize`,
    {
      method: "POST",
      headers: {
      Authorization: `Bearer ${process.env.NEXT_XPRESS_PUBLIC_KEY}`,        
      "Content-Type": "application/json",
      },
      body,
    }
  );

  const text = await response.text();

  console.log("Status:", response.status);
  console.log("Response:", text);

  if (!response.ok) {
    throw new Error(text || "Subscription initialization failed");
  }

  const result = JSON.parse(text);

  const startDate = new Date();

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const subscription = await Subscription.create({
    reference,
    email: normalizedEmail,
    amount,
    currency,
    plan,
    startDate,
    endDate,
    isActive: false,
    status: "Pending",
    user,
  });

  return {
    paymentUrl: result.paymentUrl || result.redirectUrl || result?.data?.paymentUrl,
    reference,
    transactionId: subscription.transactionId,
    startDate,
    endDate,
  };
};


export const verifySubscription = async (reference) => {
  if (!reference) {
    throw new Error("Reference is required");
  }

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

  const text = await response.text();

  console.log("VERIFY STATUS:", response.status);
  console.log("VERIFY RESPONSE:", text);

  if (!response.ok) {
    throw new Error(text || "Subscription verification failed");
  }

  const result = JSON.parse(text);

  const subscription = await Subscription.findOne({ reference });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  subscription.status = "Successful";
  subscription.isActive = true;

  // Save transactionId if returned by Xpress
  subscription.transactionId =
    result.transactionId ||
    result.TransactionId ||
    reference;

  subscription.startDate = new Date();

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  subscription.endDate = endDate;

  await subscription.save();

  return {
    success: true,
    subscription,
    result,
  };
};