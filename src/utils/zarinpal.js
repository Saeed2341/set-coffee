const merchandID = process.env.ZARINPAL_PAYMENT_MERCHAND_ID;
const zarinpalApiBaseUrl = process.env.ZARINPAL_API_BASE_URL;
const createPayment = async ({ amount, description, mobile }) => {
  try {
    const callbackUrl = process.env.ZARINPAL_PAYMENT_CALLBACK_URL;
    const res = await fetch(`${zarinpalApiBaseUrl}request.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant_id: merchandID,
        amount,
        description,
        callback_url: callbackUrl,
        metadata: {
          mobile,
        },
      }),
    });
    const data = await res.json();
    const paymentUrl =
      process.env.ZARINPAL_PAYMENT_BASE_URL + data.data.authority;

    return {
      paymentUrl,
      authority: data.data.authority,
    };
  } catch (error) {
    return error;
  }
};

const verifyPayment = async ({ amount, authority }) => {
  const verifyUrl = `${zarinpalApiBaseUrl}verify.json`;

  const res = await fetch(verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: merchandID,
      amount,
      authority,
    }),
  });

  const result = await res.json();

  if (result.data?.code === 100 || result.data?.code === 101) {
    return {
      success: true,
      refId: result.data.ref_id,
    };
  } else {
    return {
      success: false,
      code: result.data?.code || "unknown",
      message: result.errors?.message || "خطا در تایید پرداخت",
    };
  }
};

module.exports = { createPayment, verifyPayment };
