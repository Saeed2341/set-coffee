"use client";
import React, { useState, useEffect } from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import { FiTrash2, FiSearch } from "react-icons/fi";

function Table({ discounts }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      const res = await fetch(`/api/discounts/${discountID}`, { method: "DELETE" });
      if (res.status == 200) {
        swal({ title: "کد تخفیف با موفقیت حذف شد", icon: "success", buttons: "تایید" }).then(() => router.refresh());
      } else {
        swal({ title: "خطا در حذف کد تخفیف", icon: "error", buttons: "تلاش مجدد" });
      }
    });
  };

  return (
    <div className={styles.container}>
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

      {filteredDiscounts.length > 0 ? (
        !isMobile ? (
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
                    <td><span className={styles.codeBadge}>{discount.code}</span></td>
                    <td>{discount.percent}%</td>
                    <td>{discount.maxUse}</td>
                    <td>{discount.uses}</td>
                    <td>
                      <span onClick={() => removeDiscount(discount._id)} className={`${styles.iconBtn} ${styles.dangerIcon}`} title="حذف"><FiTrash2 size={16} /></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.cardsContainer}>
            {filteredDiscounts.map((discount) => (
              <div key={discount._id} className={styles.discountCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardCode}>{discount.code}</span>
                  <span className={styles.cardPercent}>{discount.percent}%</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>حداکثر استفاده:</span>
                    <span>{discount.maxUse}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>دفعات استفاده:</span>
                    <span>{discount.uses}</span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <span onClick={() => removeDiscount(discount._id)} className={`${styles.cardIcon} ${styles.dangerIcon}`} title="حذف"><FiTrash2 size={16} /></span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className={styles.empty}>
          <p>کد تخفیفی یافت نشد</p>
        </div>
      )}
    </div>
  );
}

export default Table;