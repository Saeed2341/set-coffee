"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/p-user/addresses.module.css";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AddressForm from "./AddressForm";
import swal from "sweetalert";

const AddressList = ({ addresses: initialAddresses }) => {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id) => {
    swal({
      title: "هشدار",
      text: "آیا از حذف این آدرس اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (!result) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/addresses/${id}`, {
          method: "DELETE",
        });

        if (res.status === 200) {
          setAddresses(addresses.filter((addr) => addr._id !== id));
          swal({
            title: "موفقیت",
            text: "آدرس با موفقیت حذف شد",
            icon: "success",
            buttons: "تایید",
          });
        } else {
          swal({
            title: "خطا",
            text: "مشکلی در حذف آدرس به وجود آمد",
            icon: "error",
            buttons: "تلاش مجدد",
          });
        }
      } catch (error) {
        swal({
          title: "خطا",
          text: "خطا در ارتباط با سرور",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleFormSuccess = (newAddress) => {
    if (editingAddress) {
      setAddresses(
        addresses.map((addr) =>
          addr._id === newAddress._id ? newAddress : addr,
        ),
      );
    } else {
      setAddresses([newAddress, ...addresses]);
    }
    setShowForm(false);
    setEditingAddress(null);
    router.refresh();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <div className={styles.wrapper}>
      {/* ===== دکمه افزودن آدرس ===== */}
      <button
        className={styles.addBtn}
        onClick={() => {
          setEditingAddress(null);
          setShowForm(true);
        }}
      >
        <FiPlus size={18} />
        افزودن آدرس جدید
      </button>

      {/* ===== فرم افزودن/ویرایش ===== */}
      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formWrapper}>
            <AddressForm
              address={editingAddress}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {/* ===== لیست آدرس‌ها ===== */}
      {addresses.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📍</div>
          <h2 className={styles.emptyTitle}>هیچ آدرسی ثبت نشده است</h2>
          <p className={styles.emptyDescription}>
            برای ثبت آدرس جدید، روی دکمه <strong>«افزودن آدرس جدید»</strong>{" "}
            کلیک کنید.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {addresses.map((address) => (
            <div key={address._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <span className={styles.nickname}>
                    {address.nickname || "آدرس"}
                  </span>
                  <span className={styles.badge}>پیش‌فرض</span>
                </div>
                <div className={styles.cardActions}>
                  <span
                    onClick={() => handleEdit(address)}
                    className={styles.editBtn}
                    title="ویرایش"
                  >
                    <FiEdit2 size={16} />
                  </span>
                  <span
                    onClick={() => handleDelete(address._id)}
                    className={styles.deleteBtn}
                    title="حذف"
                    disabled={isLoading}
                  >
                    <FiTrash2 size={16} />
                  </span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.name}>
                  {address.firstname} {address.lastname}
                </p>
                {address.company && (
                  <p className={styles.company}>{address.company}</p>
                )}
                <p className={styles.address}>{address.address}</p>
                <p className={styles.city}>
                  {address.city}، {address.state}
                </p>
                <p className={styles.postalCode}>
                  کدپستی: {address.postalCode}
                </p>
                <p className={styles.phone}>تلفن: {address.phone}</p>
                <p className={styles.email}>ایمیل: {address.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;
