import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "./commentForm.module.css";
import { useEffect, useState } from "react";
import { showSwal } from "@/utils/helper";
import { validateEmail } from "@/utils/validators";
const CommentForm = ({ productID }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [score, setScore] = useState(5);
  const [userID, setUserID] = useState("");
  const [isSaveUserInfo, setIsSaveUserInfo] = useState(false);

  useEffect(() => {
    const authUser = async () => {
      const res = await fetch("/api/auth/me");
      if (res.status == 200) {
        const data = await res.json();
        setUserID(data._id);
      }
    };

    authUser();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, []);

  const submitComment = async () => {
    // Validation
    if (!userID) {
      return showSwal(
        "برای ثبت دیدگاه باید وارد سایت شوید",
        "error",
        "تلاش مجدد",
      );
    }
    if (!username.trim() || !email.trim() || !body.trim()) {
      return showSwal(
        "لطفا اطلاعات خواسته شده را تکمیل کنید",
        "error",
        "تلاش مجدد",
      );
    }

    if (!validateEmail(email)) {
      return showSwal(
        "لطفا ایمیل را با فرمت صحیح وارد نمایید",
        "error",
        "تلاش مجدد",
      );
    }

    if (isSaveUserInfo) {
      const userInfo = {
        username,
        email,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }

    const newComment = {
      username,
      email,
      body,
      score,
      targetId: productID,
      targetType: "Product",
      userID,
    };
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });
    if (res.status == 201) {
      setBody("");
      setUsername("");
      setEmail("");
      setScore(5);
      return showSwal("دیدگاه شما با موفقیت ثبت شد", "success", "تایید");
    } else if (res.status == 422) {
      return showSwal(
        "لطفا اطلاعات خواسته شده را با دقت و فرمت صحیح وارد نمایید",
        "error",
        "تلاش مجدد",
      );
    }
  };
  return (
    <div className={styles.form}>
      <p className={styles.title}>دیدگاه خود را بنویسید</p>
      <p>
        نشانی ایمیل شما منتشر نخواهد شد. بخش‌های موردنیاز علامت‌گذاری شده‌اند{" "}
        <span style={{ color: "red" }}>*</span>
      </p>
      <div className={styles.rate}>
        <p>امتیاز شما :</p>
        <div>
          {[1, 2, 3, 4, 5].map((position) => (
            <div
              key={position}
              onClick={() => setScore(position)}
              style={{ cursor: "pointer" }}
            >
              {position <= score ? (
                <FaStar style={{ color: "orange" }} />
              ) : (
                <FaRegStar />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.group}>
        <label htmlFor="">
          دیدگاه شما
          <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          cols="45"
          rows="8"
          required=""
          placeholder=""
          value={body}
          onChange={(event) => setBody(event.target.value)}
        ></textarea>
      </div>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label htmlFor="">
            نام
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            type="text"
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="">
            ایمیل
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
          />
        </div>
      </div>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          value={isSaveUserInfo}
          onChange={() => setIsSaveUserInfo((prev) => !prev)}
        />
        <p>
          {" "}
          ذخیره نام، ایمیل و وبسایت من در مرورگر برای زمانی که دوباره دیدگاهی
          می‌نویسم.
        </p>
      </div>
      <button onClick={submitComment}>ثبت</button>
    </div>
  );
};

export default CommentForm;
