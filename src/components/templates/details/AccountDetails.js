"use client";
import React, { useEffect } from "react";
import styles from "@/styles/p-user/accountDetails.module.css";
import swal from "sweetalert";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";
import { useState } from "react";
import { validateEmail, validatePhone } from "@/utils/validators";
import { showSwal } from "@/utils/helper";
import { FaUserCircle } from "react-icons/fa";

function AccountDetails() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
    };
    getUser();
  }, []);

  const updateUser = async () => {
    if (!name || !validateEmail(email) || !validatePhone(phone)) {
      return showSwal(
        "اطلاعات را به صورت صحیح وارد کنید",
        "error",
        "تلاش مجدد",
      );
    }

    setIsLoading(true);

    const userNewInfos = { name, email, phone };

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userNewInfos),
      });

      if (res.status === 200) {
        swal({
          title: "اطلاعات مورد نظر با موفقیت آپدیت شد",
          icon: "success",
          buttons: "تایید",
        }).then(async () => {
          await fetch("/api/auth/signout", { method: "POST" });
          location.replace("/login-register");
        });
      }
    } catch (error) {
      showSwal("خطا در ارتباط با سرور", "error", "تلاش مجدد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.details}>
        <h1 className={styles.title}>جزئیات اکانت</h1>

        <div className={styles.details_main}>
          {/* ===== ستون اطلاعات ===== */}
          <section className={styles.infoSection}>
            <div className={styles.card}>
              <div className={styles.inputGroup}>
                <label>نام کاربری</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="لطفا نام کاربری خود را وارد کنید"
                  type="text"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>ایمیل</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="لطفا ایمیل خود را وارد کنید"
                  type="text"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>شماره تماس</label>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="لطفا شماره تماس خود را وارد کنید"
                  type="number"
                />
              </div>
            </div>
          </section>

          {/* ===== ستون تصویر و رمز عبور ===== */}
          <section className={styles.imageSection}>
            <div className={styles.card}>
              <div className={styles.uploader}>
                <FaUserCircle className={styles.avatarIcon} size={80} color="#6d4c41" />
                <div className={styles.uploaderActions}>
                  <div className={styles.uploadBtnWrapper}>
                    <button className={styles.uploadBtn}>
                      <IoCloudUploadOutline />
                      تغییر
                    </button>
                    <input type="file" />
                  </div>
                  <button className={styles.deleteBtn}>
                    <MdOutlineDelete />
                    حذف
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.inputGroup}>
                <label>رمز عبور</label>
                <div className={styles.password_group}>
                  <input type="password" placeholder="رمز عبور جدید" />
                  <button className={styles.changePassBtn}>تغییر رمز عبور</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===== دکمه ثبت تغییرات ===== */}
        <button
          type="submit"
          onClick={updateUser}
          className={`${styles.submit_btn} ${isLoading ? styles.loading : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "در حال به‌روزرسانی..." : "ثبت تغییرات"}
        </button>
      </div>
    </main>
  );
}

export default AccountDetails;