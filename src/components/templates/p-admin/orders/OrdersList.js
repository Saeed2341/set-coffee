"use client";
import { useState, useEffect } from "react";
import styles from "./orders.module.css";
import Modal from "@/components/modules/modal/Modal";
import OrderDetails from "./OrderDetails";
import swal from "sweetalert";
import {
  FiEye,
  FiEdit2,
  FiSearch,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";

const statusOptions = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار پرداخت" },
  { value: "paid", label: "پرداخت شده" },
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل داده شده" },
  { value: "cancelled", label: "لغو شده" },
  { value: "expired", label: "منقضی شده" },
];

const getStatusInfo = (status) => {
  const map = {
    pending: { label: "در انتظار پرداخت", color: "#f39c12", bg: "#fef9e7" },
    paid: { label: "پرداخت شده", color: "#27ae60", bg: "#eafaf1" },
    processing: { label: "در حال پردازش", color: "#2980b9", bg: "#ebf5fb" },
    shipped: { label: "ارسال شده", color: "#8e44ad", bg: "#f4ecf7" },
    delivered: { label: "تحویل داده شده", color: "#2ecc71", bg: "#eafaf1" },
    cancelled: { label: "لغو شده", color: "#e74c3c", bg: "#fdedec" },
    expired: { label: "منقضی شده", color: "#95a5a6", bg: "#f4f6f7" },
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

const OrdersList = ({ orders: initialOrders }) => {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const filteredOrders = orders.filter((order) => {
    const matchStatus = filter === "all" || order.status === filter;
    const matchSearch =
      !search.trim() ||
      (order.code?.toLowerCase().includes(search.toLowerCase())) ||
      (order.userID?.name?.includes(search)) ||
      (order._id?.includes(search));
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    if (!confirm("آیا از تغییر وضعیت این سفارش اطمینان دارید؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/admin/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(orders.map((o) => (o._id === orderId ? data.order : o)));
        swal({
          title: "موفقیت",
          text: "وضعیت سفارش با موفقیت تغییر کرد",
          icon: "success",
          buttons: "تایید",
        });
      } else {
        swal({
          title: "خطا",
          text: "خطا در تغییر وضعیت سفارش",
          icon: "error",
          buttons: "تایید",
        });
      }
    } catch (error) {
      swal({
        title: "خطا",
        text: "خطا در تغییر وضعیت سفارش",
        icon: "error",
        buttons: "تایید",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/admin/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order);
        setShowModal(true);
      }
    } catch (error) {
      swal({
        title: "خطا",
        text: "خطا در دریافت اطلاعات سفارش",
        icon: "error",
        buttons: "تایید",
      });
    } finally {
      setLoading(false);
    }
  };

  const hideModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className={styles.container}>
      {/* ===== هدر با جستجو و فیلتر ===== */}
      <div className={styles.header}>
        <h1 className={styles.title}>مدیریت سفارشات</h1>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجوی سفارش..."
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
        filteredOrders.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>کد سفارش</th>
                  <th>کاربر</th>
                  <th>تاریخ</th>
                  <th>تعداد</th>
                  <th>مبلغ (تومان)</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td className={styles.codeCell}>
                        <span className={styles.orderCode}>
                          {order.code || order._id.slice(-8)}
                        </span>
                      </td>
                      <td>{order.userID?.name || "نامشخص"}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{order.items?.length || 0}</td>
                      <td>{formatPrice(order.payableAmount || order.totalAmount)}</td>
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
                      <td>
                        <div className={styles.actions}>
                          <span
                            onClick={() => handleViewDetails(order._id)}
                            className={styles.iconBtn}
                            title="جزئیات"
                          >
                            <FiEye size={16} />
                          </span>
                          <div className={styles.statusDropdown}>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              disabled={loading}
                              className={styles.statusSelect}
                            >
                              {statusOptions
                                .filter((s) => s.value !== "all")
                                .map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                            </select>
                            <FiChevronDown className={styles.dropdownIcon} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.empty}>
            <p>{search ? "سفارشی با این جستجو یافت نشد" : "هیچ سفارشی وجود ندارد"}</p>
          </div>
        )
      )}

      {/* ===== در موبایل: نمایش کارت ===== */}
      {isMobile && (
        filteredOrders.length > 0 ? (
          <div className={styles.cardsContainer}>
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardCode}>
                      #{order.code || order._id.slice(-8)}
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
                      <span>{order.userID?.name || "نامشخص"}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>تاریخ:</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>تعداد اقلام:</span>
                      <span>{order.items?.length || 0}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>مبلغ:</span>
                      <span className={styles.cardPrice}>
                        {formatPrice(order.payableAmount || order.totalAmount)} تومان
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <span
                      onClick={() => handleViewDetails(order._id)}
                      className={styles.cardIcon}
                      title="جزئیات"
                    >
                      <FiEye size={16} />
                    </span>
                    <div className={styles.cardStatusDropdown}>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={loading}
                        className={styles.cardStatusSelect}
                      >
                        {statusOptions
                          .filter((s) => s.value !== "all")
                          .map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                      </select>
                      <FiChevronDown className={styles.cardDropdownIcon} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>{search ? "سفارشی با این جستجو یافت نشد" : "هیچ سفارشی وجود ندارد"}</p>
          </div>
        )
      )}

      {showModal && selectedOrder && (
        <Modal
          title={`سفارش #${selectedOrder.code || selectedOrder._id.slice(-8)}`}
          hideModal={hideModal}
        >
          <OrderDetails order={selectedOrder} />
        </Modal>
      )}
    </div>
  );
};

export default OrdersList;