"use client";
import { useState } from "react";
import styles from "./comment.module.css";
import swal from "sweetalert";
import { validateEmail } from "@/utils/validators";
import { useRouter } from "next/navigation";
const Comment = ({ articleID }) => {
  const [username, setUsername] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();
  const sendComment = async () => {
    if (!username.trim() || !body.trim() || !email.trim()) {
      return swal({
        title: "خطا!",
        text: "همه فیلدها الزامی اند",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    }
    if (!validateEmail(email)) {
      return swal({
        title: "خطا!",
        text: "ایمیل نامعتبر است",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    }

    const newComment = {
      username,
      body,
      email,
      targetId: articleID,
      targetType: "Article",
    };
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (res.status == 201) {
        return swal({
          title: "موفقیت",
          text: "دیدگاه شما با موفقیت ثبت شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => {
          setUsername("");
          setEmail("");
          setBody("");
        });
      } else if (res.status == 401) {
        return swal({
          title: "خطا!",
          text: "برای ثبت دیدگاه ابتدا وارد سایت شوید",
          icon: "error",
          buttons: ["تایید", "ورود به سایت"],
        }).then((res) => {
          if (!res) return;
          router.push("/login-register");
        });
      }
    } catch (error) {
      return swal({
        title: "خطا!",
        text: "خطای ناشناخته از سمت سرور",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    }
  };

  return (
    <div className={styles.comment}>
      <p className={styles.title}>دیدگاهتان را بنویسید</p>
      <p>
        نشانی ایمیل شما منتشر نخواهد شد. بخش‌های موردنیاز علامت‌گذاری شده‌اند{" "}
        <span>*</span>
      </p>
      <div className={styles.group}>
        <label>
          دیدگاه <span>*</span>
        </label>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          name="body"
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label>
            ایمیل <span>*</span>
          </label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
          />
        </div>
        <div className={styles.group}>
          <label>
            نام <span>*</span>
          </label>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            type="text"
          />
        </div>
      </div>
      <div className={styles.checkbox}>
        <p>
          {" "}
          .ذخیره نام، ایمیل و وبسایت من در مرورگر برای زمانی که دوباره دیدگاهی
          می‌نویسم
        </p>
        <input type="checkbox" />
      </div>
      <button onClick={sendComment}>ارسال دیدگاه</button>
    </div>
  );
};

export default Comment;
