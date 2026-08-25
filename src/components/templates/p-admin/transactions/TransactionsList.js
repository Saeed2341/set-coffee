"use client";
import { useState, useEffect } from "react";
import styles from "./transactions.module.css";
import Modal from "@/components/modules/modal/Modal";
import TransactionDetails from "./TransactionDetails";
import { FiEye, FiSearch, FiFilter } from "react-icons/fi";

const statusOptions = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "success", label: "موفق" },
  { value: "failed", label: "ناموفق" },
  { value: "refunded", label: "بازگشت داده شده" },
];

const getStatusInfo = (status) => {
  const map = {
    pending: { label: "در انتظار", color: "#f39c12", bg: "#fef9e7" },
    success: { label: "موفق", color: "#27ae60", bg: "#eafaf1" },
    failed: { label: "ناموفق", color: "#e74c3c", bg: "#fdedec" },
    refunded: { label: "بازگشت داده شده", color: "#2980b9", bg: "#ebf5fb" },
  };
  return map[status] || { label: status, color: "#7f8c8d", bg: "#f4f6f7" };
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

const TransactionsList = ({ payments: initialPayments }) => {
  const [payments, setPayments] = useState(initialPayments);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchStatus = filter === "all" || p.status === filter;
    const matchSearch =
      !search.trim() ||
      p._id?.toLowerCase().includes(search.toLowerCase()) ||
      p.order?.code?.toLowerCase().includes(search.toLowerCase()) ||
      p.order?.userID?.name?.includes(search) ||
      p.transactionID?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleViewDetails = async (paymentId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/${paymentId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPayment(data.payment);
        setShowModal(true);
      }
    } catch (error) {
      swal({
        title: "خطا",
        text: "خطا در دریافت اطلاعات تراکنش",
        icon: "error",
        buttons: "تایید",
      });
    } finally {
      setLoading(false);
    }
  };

  const hideModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  return (
    <div className={styles.container}>
      {/* ===== هدر با جستجو و فیلتر ===== */}
      <div className={styles.header}>
        <h1 className={styles.title}>مدیریت تراکنش‌ها</h1>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجوی تراکنش..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterWrapper}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ===== در دسکتاپ: نمایش جدول ===== */}
      {!isMobile && (
        filteredPayments.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>سفارش</th>
                  <th>کاربر</th>
                  <th>مبلغ (تومان)</th>
                  <th>روش پرداخت</th>
                  <th>وضعیت</th>
                  <th>تاریخ</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => {
                  const statusInfo = getStatusInfo(payment.status);
                  return (
                    <tr key={payment._id}>
                      <td>{index + 1}</td>
                      <td className={styles.codeCell}>
                        <span className={styles.orderCode}>
                          {payment.order?.code || payment._id.slice(-8)}
                        </span>
                      </td>
                      <td>{payment.order?.userID?.name || "نامشخص"}</td>
                      <td className={styles.priceCell}>
                        {formatPrice(payment.amount)}
                      </td>
                      <td>
                        {payment.paymentMethod === "online"
                          ? "آنلاین"
                          : payment.paymentMethod || "-"}
                      </td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{
                            background: statusInfo.bg,
                            color: statusInfo.color,
                            border: `1px solid ${statusInfo.color}20`,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>{formatDate(payment.createdAt)}</td>
                      <td>
                        <span
                          onClick={() => handleViewDetails(payment._id)}
                          className={styles.iconBtn}
                          title="جزئیات"
                        >
                          <FiEye size={16} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.empty}>
            <p>{search ? "تراکنشی با این جستجو یافت نشد" : "هیچ تراکنشی وجود ندارد"}</p>
          </div>
        )
      )}

      {/* ===== در موبایل: نمایش کارت ===== */}
      {isMobile && (
        filteredPayments.length > 0 ? (
          <div className={styles.cardsContainer}>
            {filteredPayments.map((payment) => {
              const statusInfo = getStatusInfo(payment.status);
              return (
                <div key={payment._id} className={styles.transactionCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardCode}>
                      #{payment.order?.code || payment._id.slice(-8)}
                    </span>
                    <span
                      className={styles.cardStatus}
                      style={{
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.color}20`,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>کاربر:</span>
                      <span>{payment.order?.userID?.name || "نامشخص"}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>مبلغ:</span>
                      <span className={styles.cardPrice}>
                        {formatPrice(payment.amount)} تومان
                      </span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>روش پرداخت:</span>
                      <span>
                        {payment.paymentMethod === "online"
                          ? "آنلاین"
                          : payment.paymentMethod || "-"}
                      </span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>تاریخ:</span>
                      <span>{formatDate(payment.createdAt)}</span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <span
                      onClick={() => handleViewDetails(payment._id)}
                      className={styles.cardIcon}
                      title="جزئیات"
                    >
                      <FiEye size={16} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>{search ? "تراکنشی با این جستجو یافت نشد" : "هیچ تراکنشی وجود ندارد"}</p>
          </div>
        )
      )}

      {showModal && selectedPayment && (
        <Modal
          title={`تراکنش #${selectedPayment._id.slice(-8)}`}
          hideModal={hideModal}
        >
          <TransactionDetails payment={selectedPayment} />
        </Modal>
      )}
    </div>
  );
};

export default TransactionsList;