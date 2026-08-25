"use client";
import React from "react";
import styles from "@/styles/forget-password.module.css";
import Link from "next/link";

const ForgetPassword = () => {
  return (
    <div className={styles.forget_password}>
      <div
        className={styles.form_bg}
        data-aos="fade-up"
        suppressHydrationWarning
      >
        <div className={styles.form}>
          {/* دکمه بازگشت به صفحه اصلی (مشابه صفحه لاگین) */}
          <Link href="/" className={styles.back_to_home}>
            ← بازگشت به صفحه اصلی
          </Link>

          <input
            className={styles.input}
            type="text"
            placeholder="ایمیل / شماره موبایل"
          />

          <button className={styles.btn}>بازنشانی رمزعبور</button>

          <Link href="/login-register" className={styles.back_to_login}>
            برگشت به ورود
          </Link>
        </div>
      </div>

      <section>
        <img src="/images/coffee-brain-caffeine-neuroscincces.webp" alt="" />
      </section>
    </div>
  );
};

export default ForgetPassword;
