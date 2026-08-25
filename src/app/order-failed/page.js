// app/order-failed/page.js
import { Suspense } from "react";
import Link from "next/link";

const FailedPage = ({ searchParams }) => {
  const reason = searchParams.reason || "unknown";
  const errorCode = searchParams.errorCode || "";
  const message =
    searchParams.message ||
    "پرداخت شما با خطا مواجه شد. لطفاً مجدداً تلاش کنید.";

  return (
    <main style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ color: "#e74c3c" }}>پرداخت ناموفق</h1>
      <p>{message}</p>
      {errorCode && <p>کد خطا: {errorCode}</p>}
      <div style={{ marginTop: "20px" }}>
        <Link href="/checkout">
          <button style={{ padding: "12px 24px", margin: "10px" }}>
            تلاش مجدد
          </button>
        </Link>
        <Link href="/">
          <button style={{ padding: "12px 24px", margin: "10px" }}>
            بازگشت به فروشگاه
          </button>
        </Link>
      </div>
    </main>
  );
};

export default FailedPage;
