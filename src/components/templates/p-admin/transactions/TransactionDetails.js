"use client";
import styles from "./transactionDetails.module.css";

const getStatusInfo = (status) => {
  const map = {
    pending: { label: "در انتظار", color: "#f39c12" },
    success: { label: "موفق", color: "#27ae60" },
    failed: { label: "ناموفق", color: "#e74c3c" },
    refunded: { label: "بازگشت داده شده", color: "#2980b9" },
  };
  return map[status] || { label: status, color: "#7f8c8d" };
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatPrice = (price) => {
  if (!price) return "۰";
  return price.toLocaleString("fa-IR");
};

const TransactionDetails = ({ payment }) => {
  const statusInfo = getStatusInfo(payment.status);

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>شناسه تراکنش</span>
          <span className={styles.infoValue}>{payment._id}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>کد رهگیری</span>
          <span className={styles.infoValue}>{payment.transactionID || "-"}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>مبلغ</span>
          <span className={styles.infoValue} style={{ fontSize: "18px", color: "#6d4c41" }}>
            {formatPrice(payment.amount)} تومان
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>وضعیت</span>
          <span className={styles.infoValue} style={{ color: statusInfo.color }}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>اطلاعات سفارش مرتبط</h4>
        <div className={styles.infoBox}>
          <p><strong>کد سفارش:</strong> {payment.order?.code || "-"}</p>
          <p><strong>کاربر:</strong> {payment.order?.userID?.name || "نامشخص"}</p>
          <p><strong>ایمیل:</strong> {payment.order?.userID?.email || "-"}</p>
          <p><strong>مبلغ کل سفارش:</strong> {formatPrice(payment.order?.totalAmount)} تومان</p>
          <p><strong>وضعیت سفارش:</strong> {payment.order?.status || "-"}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>اطلاعات پرداخت</h4>
        <div className={styles.infoBox}>
          <p><strong>روش پرداخت:</strong> {payment.paymentMethod === "online" ? "آنلاین" : payment.paymentMethod}</p>
          <p><strong>درگاه:</strong> {payment.provider === "zarinpal" ? "زرین‌پال" : payment.provider}</p>
          <p><strong>تاریخ پرداخت:</strong> {formatDate(payment.paymentDate)}</p>
          <p><strong>تاریخ ایجاد:</strong> {formatDate(payment.createdAt)}</p>
          <p><strong>تاریخ به‌روزرسانی:</strong> {formatDate(payment.updatedAt)}</p>
        </div>
      </div>

      {payment.gatewayResponse && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>پاسخ درگاه</h4>
          <pre className={styles.gatewayResponse}>
            {JSON.stringify(payment.gatewayResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;