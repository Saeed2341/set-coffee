// components/templates/p-user/orders/Orders.jsx
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/templates/p-user/orders/DataTable";
import tableStyles from "./dataTable.module.css";
import Modal from "@/components/modules/modal/Modal";
import styles from "./orders.module.css";
import Pagination from "@/components/modules/pagination/Pagination";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?page=${page}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setOrdersCount(data.totalPages);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= ordersCount) {
      setPage(newPage);
    }
  };

  const handleShowDetails = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const hideModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // ===== توابع کمکی =====
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div className={tableStyles.spinner}></div>
        <p>در حال بارگذاری سفارشات...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={tableStyles.empty}>
        <p>شما هنوز سفارشی ثبت نکرده‌اید.</p>
      </div>
    );
  }

  return (
    <>
      <main>
        <DataTable title="سفارش‌ها">
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>شناسه</th>
                <th>تاریخ</th>
                <th>وضعیت</th>
                <th>تعداد اقلام</th>
                <th>مبلغ (تومان)</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <tr key={order._id}>
                    <td>{order.code || order._id.slice(-6)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <span
                        style={{
                          background: statusInfo.color,
                          color: "#fff",
                          padding: "4px 14px",
                          borderRadius: "30px",
                          fontSize: "12px",
                          fontWeight: 500,
                          display: "inline-block",
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>{order.itemsCount}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleShowDetails(order._id)}
                        className={tableStyles.btn}
                      >
                        نمایش
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={ordersCount}
            onPageChange={handlePageChange}
          />
        </DataTable>
      </main>

      {/* ===== مودال جزئیات سفارش ===== */}
      {showModal && selectedOrder && (
        <Modal
          title={`سفارش #${selectedOrder.code || selectedOrder._id.slice(-6)}`}
          hideModal={hideModal}
        >
          <div className={styles.modal_content}>
            <p className={styles.modal_title}>
              سفارش در تاریخ {formatDate(selectedOrder.createdAt)} ثبت شده است و
              در حال حاضر در وضعیت{" "}
              <strong
                style={{ color: getStatusInfo(selectedOrder.status).color }}
              >
                {getStatusInfo(selectedOrder.status).label}
              </strong>{" "}
              می‌باشد.
            </p>

            <div className={styles.groups}>
              <div className={styles.group_header}>
                <p>محصول</p>
                <p>تعداد</p>
                <p>قیمت واحد</p>
                <p>مجموع</p>
              </div>

              {selectedOrder.items.map((item, index) => (
                <div key={index} className={styles.group_row}>
                  <p>{item.name}</p>
                  <p>{item.quantity}</p>
                  <p>{formatPrice(item.unitPrice)}</p>
                  <p>{formatPrice(item.totalPrice)}</p>
                </div>
              ))}

              <div className={styles.group_total}>
                <p>جمع کل سبد خرید:</p>
                <p>{formatPrice(selectedOrder.totalAmount)} تومان</p>
              </div>

              {selectedOrder.discountAmount > 0 && (
                <div className={styles.group_discount}>
                  <p>تخفیف:</p>
                  <p>- {formatPrice(selectedOrder.discountAmount)} تومان</p>
                </div>
              )}
              <div className={styles.group_discount}>
                <p>هزینه ارسال:</p>
                <p>+ {formatPrice(selectedOrder.shippingCost)} تومان</p>
              </div>
              <div className={styles.group_discount}>
                <p>مالیات برارزش افزوده:</p>
                <p>+ {formatPrice(selectedOrder.taxAmount)} تومان</p>
              </div>
              <div className={styles.group_final}>
                <p>قیمت نهایی:</p>
                <p>{formatPrice(selectedOrder.payableAmount)} تومان</p>
              </div>
            </div>

            <div className={styles.modal_bill}>
              <p>آدرس صورت‌حساب:</p>
              <div>
                <p>
                  {selectedOrder.shippingAddress.firstname}{" "}
                  {selectedOrder.shippingAddress.lastname}
                </p>
                <p>{selectedOrder.shippingAddress.phone}</p>
                <p>{selectedOrder.shippingAddress.email}</p>
                <p>
                  {selectedOrder.shippingAddress.address}،{" "}
                  {selectedOrder.shippingAddress.city}،{" "}
                  {selectedOrder.shippingAddress.state}
                </p>
                <p>کدپستی: {selectedOrder.shippingAddress.postalCode}</p>
              </div>
            </div>

            <button
              className={styles.modal_btn}
              onClick={() => (window.location.href = "/category")}
            >
              سفارش دوباره
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Orders;
