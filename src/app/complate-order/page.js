// app/complate-order/page.js
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Stepper from "@/components/modules/stepper/Stepper";
import styles from "@/styles/complate-order.module.css";
import Link from "next/link";
import { authUser } from "@/utils/auth";
import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import ClearCart from "@/components/templates/complate-order/clearCart";
import MobileNav from "@/components/modules/mobileNav/MobileNav";

const toPersianDate = (date) => {
  if (!date) return "نامشخص";
  const d = new Date(date);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    calendar: "persian",
  }).format(d);
};

const formatPrice = (price) => {
  if (!price) return "۰";
  return price.toLocaleString("fa-IR");
};

const page = async ({ searchParams }) => {
  const user = await authUser();
  
  const { status, orderId, errorCode, message } = await searchParams;
  const isSuccess = status === "success";

  let order = null;
  let orderCode = "---";
  let date = "---";
  let totalAmount = "---";
  let paymentMethod = "---";
  let orderStatus = "---";
  let isPaid = false;

  if (orderId) {
    await connectToDB();
    order = await OrderModel.findOne({
      _id: orderId,
      userID: user?._id,
    });

    if (order) {
      orderCode = order.code || "نامشخص";
      date = toPersianDate(order.createdAt);
      totalAmount = formatPrice(order.payableAmount || order.totalAmount || 0);
      paymentMethod = order.paymentMethod || "زرین‌پال";
      orderStatus = order.status === "paid" ? "پرداخت شده" : "در انتظار پرداخت";
      isPaid = order.status === "paid";
    }
  }

  let title = "";
  let subtitle = "";
  let iconType = "success"; // 'success' | 'error'
  let buttonLinks = [];

  if (status === "success" && isPaid) {
    title = "پرداخت موفق";
    subtitle = "سفارش شما با موفقیت ثبت شد.";
    iconType = "success";
    buttonLinks = [
      { href: "/p-user/orders", text: "مشاهده جزئیات سفارش", primary: true },
      { href: "/", text: "بازگشت به فروشگاه", primary: false },
    ];
  } else {
    let errorMessage =
      message || "پرداخت شما با خطا مواجه شد. لطفاً مجدداً تلاش کنید.";

    if (errorCode === "user_canceled") {
      errorMessage =
        "شما پرداخت را لغو کردید. در صورت تمایل می‌توانید مجدداً تلاش کنید.";
    } else if (errorCode === "order_not_found") {
      errorMessage = "سفارش مورد نظر یافت نشد. ممکن است منقضی شده باشد.";
    } else if (errorCode === "verification_failed") {
      errorMessage =
        message || "تایید پرداخت توسط بانک انجام نشد. لطفاً مجدداً تلاش کنید.";
    } else if (errorCode === "network_error") {
      errorMessage = "مشکل در ارتباط با درگاه پرداخت. لطفاً مجدداً تلاش کنید.";
    }

    title = "پرداخت ناموفق";
    subtitle = errorMessage;
    iconType = "error";
    buttonLinks = [{ href: "/", text: "بازگشت به فروشگاه", primary: false }];
  }

  return (
    <>
      {isSuccess && <ClearCart shouldClear={true} />}
      <Navbar
        isLogin={user ? true : false}
        isAdmin={user && user.role === "ADMIN" ? true : false}
        userID={user && user._id.toString()}
      />
      <Stepper step="complate" />
      <main className={styles.container}>
        <div className={styles.box}>
          {/* ===== بخش وضعیت ===== */}
          <div className={styles.status}>
            {iconType === "success" ? (
              <svg
                viewBox="0 0 24 24"
                width="48"
                height="48"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#27ae60"
                  strokeWidth="2"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="#27ae60"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="48"
                height="48"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#e74c3c"
                  strokeWidth="2"
                />
                <path
                  d="M15 9L9 15M9 9L15 15"
                  stroke="#e74c3c"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <h2
              style={{ color: iconType === "success" ? "#27ae60" : "#e74c3c" }}
            >
              {title}
            </h2>
            <p>{subtitle}</p>
            {errorCode && iconType === "error" && (
              <p style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                کد خطا: {errorCode}
              </p>
            )}
          </div>

          {order && (
            <ul>
              <li>
                <span>شماره سفارش</span>
                <span>{orderCode}</span>
              </li>
              <li>
                <span>تاریخ ثبت</span>
                <span>{date}</span>
              </li>
              <li>
                <span>قیمت نهایی</span>
                <strong>{totalAmount} تومان</strong>
              </li>
              <li>
                <span>روش پرداخت</span>
                <span>{paymentMethod}</span>
              </li>
              <li>
                <span>وضعیت</span>
                <span style={{ color: isPaid ? "#27ae60" : "#e67e22" }}>
                  {orderStatus}
                </span>
              </li>
            </ul>
          )}

          {/* ===== دکمه‌ها ===== */}
          <div>
            {buttonLinks.map((btn, index) => (
              <Link key={index} href={btn.href}>
                <button
                  style={{
                    flex: btn.primary ? 1 : undefined,
                    background: btn.primary ? "#a67c52" : "#f4f3f0",
                    color: btn.primary ? "#ffffff" : "#1a1a1a",
                    border: btn.primary ? "none" : "2px solid #e8e5e0",
                  }}
                >
                  {btn.text}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
           <MobileNav
        isLogin={user ? true : false}
        isAdmin={user?.role == "ADMIN" ? true : false}
      />
    </>
  );
};

export default page;
