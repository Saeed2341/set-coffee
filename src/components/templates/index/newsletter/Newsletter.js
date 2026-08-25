"use client";

import { useState } from "react";
import styles from "./newsletter.module.css";
import { FiMail } from "react-icons/fi";
import { showSwal } from "@/utils/helper";
import { validateEmail } from "@/utils/validators";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return showSwal("لطفا ایمیل خود را وارد کنید", "error", "تلاش مجدد");
    }

    if (!validateEmail(email)) {
      return showSwal("لطفا ایمیل معتبر وارد کنید", "error", "تلاش مجدد");
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setIsLoading(false);

      if (res.status === 201) {
        setEmail("");
        return showSwal("ایمیل شما با موفقیت ثبت شد", "success", "متشکرم");
      } else if (res.status === 409) {
        return showSwal("این ایمیل قبلاً ثبت شده است", "error", "تایید");
      } else if (res.status === 422) {
        return showSwal("ایمیل نامعتبر است", "error", "تایید");
      } else {
        return showSwal(
          "مشکلی در ثبت ایمیل رخ داد، لطفاً مجدد تلاش کنید",
          "error",
          "تلاش مجدد",
        );
      }
    } catch (error) {
      setIsLoading(false);
      return showSwal("خطا در ارتباط با سرور", "error", "تلاش مجدد");
    }
  };

  return (
    <div className={styles.container} data-aos="fade-up" suppressHydrationWarning>
      <div className={styles.newsletter}>
        <div className={styles.icon_wrapper}>
          <FiMail className={styles.icon} />
        </div>
        <h2 className={styles.title}>عضویت در خبرنامه</h2>
        <p className={styles.description}>
          با عضویت در خبرنامه قهوه ست، از جدیدترین محصولات، تخفیف‌ها و رویدادهای
          ویژه مطلع شوید.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "در حال ثبت..." : "عضویت"}
          </button>

          <input
            type="email"
            className={styles.input}
            placeholder="ایمیل خود را وارد کنید..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            dir="ltr"
          />
        </form>
        <p className={styles.note}>
          .با عضویت، با <a href="/rules">قوانین و حریم خصوصی</a> ما موافقت
          می‌کنید
        </p>
      </div>
    </div>
  );
};

export default Newsletter;
