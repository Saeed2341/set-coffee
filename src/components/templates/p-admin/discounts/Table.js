"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import { FiTrash2, FiSearch } from "react-icons/fi";

function Table({ discounts }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // ===== فیلتر کردن تخفیف‌ها بر اساس کد =====
  const filteredDiscounts = discounts.filter((discount) =>
    discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeDiscount = (discountID) => {
    if (!discountID) return;

    swal({
      title: "هشدار",
      text: "آیا از حذف کد تخفیف اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (!result) return;
      const res = await fetch(`/api/discounts/${discountID}`, {
        method: "DELETE",
      });
      if (res.status == 200) {
        swal({
          title: "کد تخفیف با موفقیت حذف شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => router.refresh());
      } else {
        return swal({
          title: "خطا در حذف کد تخفیف",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* ===== هدر با عنوان + جستجو ===== */}
      <div className={styles.header}>
        <h1 className={styles.title}>لیست تخفیف‌ها</h1>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="جستجوی کد تخفیف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* ===== جدول ===== */}
      {filteredDiscounts.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>کد</th>
                <th>درصد</th>
                <th>حداکثر استفاده</th>
                <th>دفعات استفاده</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.map((discount, index) => (
                <tr key={discount._id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className={styles.codeBadge}>{discount.code}</span>
                  </td>
                  <td>{discount.percent}%</td>
                  <td>{discount.maxUse}</td>
                  <td>{discount.uses}</td>
                  <td>
                    <span
                      onClick={() => removeDiscount(discount._id)}
                      className={`${styles.iconBtn} ${styles.dangerIcon}`}
                      title="حذف"
                    >
                      <FiTrash2 size={16} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.empty}>
          <p>کد تخفیفی یافت نشد</p>
        </div>
      )}
    </div>
  );
}

export default Table;