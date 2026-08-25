"use client";
import React, { useState, useEffect } from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import { FiEdit2, FiUserCheck, FiTrash2, FiUserX, FiSearch } from "react-icons/fi";

export default function DataTable({ users, title }) {
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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const changeRole = async (userID) => {
    const res = await fetch(`/api/user/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userID }),
    });

    if (res.status == 200) {
      return swal({
        title: "تغییر نقش با موفقیت انجام شد",
        icon: "success",
        buttons: "تایید",
      }).then(() => router.refresh());
    }
  };

  const deleteUser = async (userID) => {
    swal({
      title: "از حذف کاربر اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch(`/api/user`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userID }),
        });

        if (res.status == 200) {
          return swal({
            title: "کاربر با موفقیت حذف شد",
            icon: "success",
            buttons: "تایید",
          }).then(() => router.refresh());
        }
      }
    });
  };

  const banUser = async (userEmail, userPhone) => {
    swal({
      title: "از این عمل اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch(`/api/user/ban`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, phone: userPhone }),
        });

        if (res.status == 201) {
          return swal({
            title: "کاربر با موفقیت مسدود شد",
            icon: "success",
            buttons: "تایید",
          }).then(() => router.refresh());
        } else if (res.status == 200) {
          return swal({
            title: "کاربر با موفقیت آزاد شد",
            icon: "success",
            buttons: "تایید",
          }).then(() => router.refresh());
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* ===== هدر با عنوان + جستجو ===== */}
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="جستجوی کاربر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* ===== در دسکتاپ: نمایش جدول ===== */}
      {!isMobile && (
        filteredUsers.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>شناسه</th>
                  <th>نام و نام خانوادگی</th>
                  <th>ایمیل</th>
                  <th>نقش</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email ? user.email : "—"}</td>
                    <td>{user.role === "USER" ? "کاربر عادی" : "مدیر"}</td>
                    <td>
                      <div className={styles.actions}>
                        <span
                          onClick={() => router.replace(`/p-admin/users?mode=edit&id=${user._id}`)}
                          className={styles.iconBtn}
                          title="ویرایش"
                        >
                          <FiEdit2 size={16} />
                        </span>
                        <span
                          onClick={() => changeRole(user._id)}
                          className={styles.iconBtn}
                          title="تغییر نقش"
                        >
                          <FiUserCheck size={16} />
                        </span>
                        <span
                          onClick={() => deleteUser(user._id)}
                          className={`${styles.iconBtn} ${styles.dangerIcon}`}
                          title="حذف"
                        >
                          <FiTrash2 size={16} />
                        </span>
                        <span
                          onClick={() => banUser(user?.email, user?.phone)}
                          className={`${styles.iconBtn} ${styles.dangerIcon}`}
                          title="مسدود"
                        >
                          <FiUserX size={16} />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.empty}>
            <p>{searchTerm ? "کاربری با این جستجو یافت نشد" : "کاربری وجود ندارد"}</p>
          </div>
        )
      )}

      {/* ===== در موبایل: نمایش کارت ===== */}
      {isMobile && (
        filteredUsers.length > 0 ? (
          <div className={styles.cardsContainer}>
            {filteredUsers.map((user) => (
              <div key={user._id} className={styles.userCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardName}>{user.name}</span>
                  <span className={styles.cardRole}>
                    {user.role === "USER" ? "کاربر عادی" : "مدیر"}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>ایمیل:</span>
                    <span>{user.email ? user.email : "—"}</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <span
                    onClick={() => router.replace(`/p-admin/users?mode=edit&id=${user._id}`)}
                    className={styles.cardIcon}
                    title="ویرایش"
                  >
                    <FiEdit2 size={16} />
                  </span>
                  <span
                    onClick={() => changeRole(user._id)}
                    className={styles.cardIcon}
                    title="تغییر نقش"
                  >
                    <FiUserCheck size={16} />
                  </span>
                  <span
                    onClick={() => deleteUser(user._id)}
                    className={`${styles.cardIcon} ${styles.dangerIcon}`}
                    title="حذف"
                  >
                    <FiTrash2 size={16} />
                  </span>
                  <span
                    onClick={() => banUser(user?.email, user?.phone)}
                    className={`${styles.cardIcon} ${styles.dangerIcon}`}
                    title="مسدود"
                  >
                    <FiUserX size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>{searchTerm ? "کاربری با این جستجو یافت نشد" : "کاربری وجود ندارد"}</p>
          </div>
        )
      )}
    </div>
  );
}