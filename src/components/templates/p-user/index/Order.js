import Link from "next/link";
import styles from "./order.module.css";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const Order = ({ _id, items, status, createdAt, totalAmount }) => {
  // ===== تعیین وضعیت =====
  const getStatusInfo = (status) => {
    switch (status) {
      case "delivered":
        return {
          label: "تحویل داده شده",
          icon: <FaCheckCircle size={14} />,
          className: styles.statusDelivered,
        };
      case "processing":
        return {
          label: "در حال پردازش",
          icon: <FaClock size={14} />,
          className: styles.statusProcessing,
        };
      case "expired":
        return {
          label: "منقضی شده",
          icon: <FaTimesCircle size={14} />,
          className: styles.statusCancelled,
        };
      case "cancelled":
        return {
          label: "لغو شده",
          icon: <FaTimesCircle size={14} />,
          className: styles.statusCancelled,
        };
      case "paid":
        return {
          label: "پرداخت شده",
          icon: <FaCheckCircle size={14} />,
          className: styles.statusDelivered,
        };
      default:
        return {
          label: "در انتظار پرداخت",
          icon: <FaClock size={14} />,
          className: styles.statusPending,
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const firstProduct = items?.[0] || {};
  const productCount = items?.length || 0;

  return (
    <Link href={`/p-user/orders`} className={styles.card}>
      {/* ===== سمت راست: تصویر و نام محصول ===== */}
      <div className={styles.productInfo}>
        <img
          src={firstProduct.img || "/images/prduct-default-image.png"}
          alt={firstProduct.name || "محصول"}
          className={styles.productImage}
        />
        <div className={styles.productDetails}>
          <p className={styles.productName}>
            {firstProduct.name || "محصول نامشخص"}
          </p>
          {productCount > 1 && (
            <span className={styles.productCount}>
              + {productCount - 1} محصول دیگر
            </span>
          )}
        </div>
      </div>

      {/* ===== وسط: وضعیت ===== */}
      <div className={styles.statusWrapper}>
        <span className={`${styles.statusBadge} ${statusInfo.className}`}>
          {statusInfo.icon}
          {statusInfo.label}
        </span>
      </div>

      {/* ===== سمت چپ: تاریخ و قیمت ===== */}
      <div className={styles.metaInfo}>
        <span className={styles.date}>
          {new Date(createdAt).toLocaleDateString("fa-IR")}
        </span>
        <span className={styles.price}>
          {totalAmount.toLocaleString("fa-IR")} تومان
        </span>
      </div>
    </Link>
  );
};

export default Order;
