
export const initializePayment = async (data) => {
  const response = await fetch(
    `${process.env.NEXT_PAYSTACK_URL}/transaction/initialize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};

export const verifyPayment = async (reference) => {
  const response = await fetch(
    `${process.env.NEXT_PAYSTACK_URL}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.json();
};