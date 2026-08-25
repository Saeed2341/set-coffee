"use client";
import { useState } from "react";
import styles from "./form.module.css";
import { showSwal } from "@/utils/helper";
import { validateEmail, validatePhone } from "@/utils/validators";

const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!name || !email || !phone || !message) {
      return showSwal(
        "لطفا فیلد های خواسته شده را تکمیل کنید",
        "error",
        "تلاش مجدد",
      );
    }
    if (!validateEmail(email) || !validatePhone(phone)) {
      return showSwal("ایمیل یا شماره تماس نامعتبر است", "error", "تلاش مجدد");
    }

    setIsLoading(true);

    const newMessage = { name, email, phone, company, message };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (res.status == 201) {
        setName("");
        setEmail("");
        setPhone("");
        setCompany("");
        setMessage("");
        return showSwal("پیام شما با موفقیت ارسال شد", "success", "تایید");
      } else if (res.status == 422) {
        return showSwal(
          "اطلاعات خواسته شده را با دقت تکمیل کنید",
          "error",
          "تلاش مجدد",
        );
      }
    } catch (error) {
      showSwal("خطا در ارتباط با سرور", "error", "تلاش مجدد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form}>
      <span>فرم تماس با ما</span>
      <p>برای تماس با ما می توانید فرم زیر را تکمیل کنید</p>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label>* نام و نام خانوادگی</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
          />
        </div>
        <div className={styles.group}>
          <label>* آدرس ایمیل</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="text"
          />
        </div>
      </div>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label>* شماره تماس</label>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            type="text"
          />
        </div>
        <div className={styles.group}>
          <label>نام شرکت</label>
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            type="text"
          />
        </div>
      </div>
      <div className={styles.group}>
        <label>* درخواست شما</label>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          name=""
          id=""
          cols="30"
          rows="3"
        ></textarea>
      </div>
      <button
        onClick={sendMessage}
        className={`${styles.submitBtn} ${isLoading ? styles.loading : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "...در حال ارسال" : "ارسال"}
      </button>
    </form>
  );
};

export default Form;
