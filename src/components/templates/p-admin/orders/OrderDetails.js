"use client";
import styles from "./orderDetails.module.css";

const getStatusInfo = (status) => {
  const map = {
    pending: { label: "در انتظار پرداخت", color: "#f39c12" },
    paid: { label: "پرداخت شده", color: "#27ae60" },
    processing: { label: "در حال پردازش", color: "#2980b9" },
    shipped: { label: "ارسال شده", color: "#8e44ad" },
    delivered: { label: "تحویل داده شده", color: "#2ecc71" },
    cancelled: { label: "لغو شده", color: "#e74c3c" },
    expired: { label: "منقضی شده", color: "#95a5a6" },
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

const OrderDetails = ({ order }) => {
  const statusInfo = getStatusInfo(order.status);

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>کد سفارش</span>
          <span className={styles.infoValue}>{order.code || order._id}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>تاریخ ثبت</span>
          <span className={styles.infoValue}>{formatDate(order.createdAt)}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>وضعیت</span>
          <span className={styles.infoValue} style={{ color: statusInfo.color }}>
            {statusInfo.label}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>تاریخ پرداخت</span>
          <span className={styles.infoValue}>{formatDate(order.paidAt)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>اطلاعات کاربر</h4>
        <div className={styles.infoBox}>
          <p><strong>نام:</strong> {order.userID?.name || "نامشخص"}</p>
          <p><strong>ایمیل:</strong> {order.userID?.email || "-"}</p>
          <p><strong>شماره موبایل:</strong> {order.shippingAddress?.phone || "-"}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>آدرس ارسال</h4>
        <div className={styles.infoBox}>
          <p>{order.shippingAddress?.firstname} {order.shippingAddress?.lastname}</p>
          <p>{order.shippingAddress?.address}</p>
          <p>{order.shippingAddress?.city}، {order.shippingAddress?.state}</p>
          <p>کدپستی: {order.shippingAddress?.postalCode}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>محصولات سفارش</h4>
        <div className={styles.itemsTable}>
          <div className={styles.itemsHeader}>
            <span>نام محصول</span>
            <span>تعداد</span>
            <span>قیمت واحد</span>
            <span>مجموع</span>
          </div>
          {order.items?.map((item, idx) => (
            <div key={idx} className={styles.itemsRow}>
              <span>{item.name}</span>
              <span>{item.quantity}</span>
              <span>{formatPrice(item.unitPrice)}</span>
              <span>{formatPrice(item.totalPrice)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.totalSection}>
        <div className={styles.totalRow}>
          <span>جمع کل</span>
          <span>{formatPrice(order.totalAmount)} تومان</span>
        </div>
        {order.discountAmount > 0 && (
          <div className={styles.totalRow}>
            <span>تخفیف</span>
            <span style={{ color: "#e74c3c" }}>- {formatPrice(order.discountAmount)} تومان</span>
          </div>
        )}
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>قیمت نهایی</span>
          <span className={styles.totalPrice}>{formatPrice(order.payableAmount)} تومان</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;