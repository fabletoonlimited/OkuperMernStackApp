export const initializePayment = async (data) => {
  const response = await fetch(
    `${process.env.NEXT_XPRESS_URL}/Payments/Initialize`,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_XPRESS_SECRET_KEY}`,
        },
        body: JSON.stringify(data),
        }
    );
  return response.json();
};

export const verifyPayment = async (reference) => {
  const response = await fetch(
    `${process.env.NEXT_XPRESS_URL}/Payments/VerifyPayment/${reference}`,
    {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.NEXT_XPRESS_SECRET_KEY}`,
            "Content-Type": "application/json"
        },
    }
  );
  return response.json();
};