"use client";
import { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import Sms from "./Sms";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/utils/validators";
import { showSwal } from "@/utils/helper";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

const Login = ({ showRegisterForm }) => {
  const [isLoginWithOtp, setIsLoginWithOtp] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const hideOtpForm = () => setIsLoginWithOtp(false);

  const loginWithPass = async () => {
    if (!emailOrPhone)
      return showSwal(
        "ایمیل یا شماره تماس را وارد کنید",
        "error",
        "تلاش مجدد ",
      );
    if (!password)
      return showSwal("رمز عبور را وارد کنید", "error", "تلاش مجدد ");
    if (!validateEmail(emailOrPhone))
      return showSwal("ایمیل وارد شده معتبر نیست", "error", "تلاش مجدد ");
    if (!validatePassword(password))
      return showSwal("رمز عبور وارد شده معتبر نیست", "error", "تلاش مجدد ");

    setIsLoading(true); // ← شروع لودینگ

    const user = { email: emailOrPhone, password };
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.status == 200) {
        swal({
          title: "ورود با موفقیت انجام شد",
          icon: "success",
          buttons: "ورود به پنل کاربری",
        }).then(() => {
          router.replace("/p-user");
        });
      } else if (res.status == 422) {
        return showSwal("ایمیل یا رمز عبور نادرست است", "error", "تلاش مجدد");
      } else if (res.status == 409) {
        return showSwal("کاربری یافت نشد", "error", "تلاش مجدد");
      }
    } catch (error) {
      showSwal("خطا در ارتباط با سرور", "error", "تلاش مجدد");
    } finally {
      setIsLoading(false); // ← پایان لودینگ
    }
  };

  const loginWithOtp = () => {
    if (!emailOrPhone.trim()) {
      return swal({
        title: "خطا!",
        text: "لطفا شماره موبایل خود را وارد کنید",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    }
    if (!validatePhone(emailOrPhone)) {
      return swal({
        title: "خطا!",
        text: "لطفا شماره موبایل خود را با فرمت صحیح وارد کنید",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    }
    setIsLoginWithOtp(true);
  };

  return (
    <>
      {!isLoginWithOtp ? (
        <>
          <div
            className={styles.form}
            data-aos="fade-up"
            suppressHydrationWarning
          >
            <Link href="/" className={styles.back_to_home}>
              ← بازگشت به صفحه اصلی
            </Link>

            <input
              className={styles.input}
              type="text"
              placeholder="ایمیل/شماره موبایل"
              value={emailOrPhone}
              onChange={(event) => setEmailOrPhone(event.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className={styles.checkbox}>
              <input type="checkbox" name="" id="" />
              <p>مرا به یاد داشته باش</p>
            </div>

            {/* ===== دکمه ورود با لودینگ متنی ===== */}
            <button
              onClick={loginWithPass}
              className={`${styles.btn} ${isLoading ? styles.btnLoading : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "...در حال ورود" : "ورود"}
            </button>

            <Link href={"/forget-password"} className={styles.forgot_pass}>
              رمز عبور را فراموش کرده اید؟
            </Link>
            <button onClick={loginWithOtp} className={styles.btn}>
              ورود با کد یکبار مصرف
            </button>
            <span>ایا حساب کاربری ندارید؟</span>
            <button onClick={showRegisterForm} className={styles.btn_light}>
              ثبت نام
            </button>
          </div>
        </>
      ) : (
        <Sms phone={emailOrPhone || ""} hideOtpForm={hideOtpForm} />
      )}
    </>
  );
};

export default Login;
