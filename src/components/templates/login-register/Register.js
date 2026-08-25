"use client";
import { useState } from "react";
import styles from "./register.module.css";
import Sms from "./Sms";
import { showSwal } from "@/utils/helper";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/utils/validators";

const Register = ({ showloginForm }) => {
  const [isRegisterWithOtp, setIsRegisterWithOtp] = useState(false);
  const [isRegisterWithPass, setIsRegisterWithPass] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hideOtpForm = () => setIsRegisterWithOtp(false);
  const registerWithOtp = () => {
    if (!phone.trim()) {
      return swal({
        title: "خطا!",
        text: "لطفا شماره موبایل خود را وارد کنید",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    }
    if (!validatePhone(phone)) {
      return swal({
        title: "خطا!",
        text: "لطفا شماره موبایل خود را با فرمت صحیح وارد کنید",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    }
    setIsRegisterWithOtp(true);
  };
  const signup = async () => {
    // Validation
    if (!name.trim()) {
      return showSwal("نام نمیتواند خالی باشد", "error", "تلاش مجدد");
    }
    if (!validatePhone(phone)) {
      return showSwal("شماره تماس نامعتبر است", "error", "تلاش مجدد");
    }
    if (email) {
      const isValid = validateEmail(email);
      if (!isValid) return showSwal("ایمیل نامعتبر است", "error", "تلاش مجدد");
    }
    if (!validatePassword(password)) {
      return showSwal("رمز عبور باید پیچیده باشد", "error", "تلاش مجدد");
    }

    const user = { name, phone, email, password };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "applicatoin/json",
      },
      body: JSON.stringify(user),
    });

    if (res.status == 201) {
      return showSwal(
        "ثبت نام با موفقیت انجام شد",
        "success",
        "ورود به پنل کاربری",
      );
    } else if (res.status == 409) {
      return showSwal(
        "کاربر با این اطلاعات از قبل وجود دارد",
        "error",
        "تلاش مجدد",
      );
    } else if (res.status == 422) {
      return showSwal(
        "لطفا اطلاعات را با فرمت صحیح وارد کنید",
        "error",
        "تلاش مجدد",
      );
    }
  };

  return (
    <>
      {!isRegisterWithOtp ? (
        <>
          <div
            className={styles.form}
            data-aos="fade-up"
            suppressHydrationWarning
          >
            {/* ===== دکمه بازگشت به ورود (جایگزین لغو) ===== */}
            <button
              onClick={showloginForm}
              className={styles.back_to_login_btn}
            >
              ← بازگشت به ورود
            </button>

            <input
              className={styles.input}
              type="text"
              placeholder="نام"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="شماره موبایل  "
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <input
              className={styles.input}
              type="email"
              placeholder="ایمیل (دلخواه)"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            {isRegisterWithPass && (
              <input
                className={styles.input}
                type="password"
                placeholder="رمز عبور"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            )}
            <button
              onClick={registerWithOtp}
              style={{ marginTop: "1rem" }}
              className={styles.btn}
            >
              ثبت نام با کد تایید
            </button>
            <button
              onClick={() => {
                if (isRegisterWithPass) {
                  signup();
                } else {
                  setIsRegisterWithPass(true);
                }
              }}
              style={{ marginTop: ".7rem" }}
              className={styles.btn}
            >
              ثبت نام با رمزعبور
            </button>
            <p onClick={showloginForm} className={styles.back_to_login}>
              برگشت به ورود
            </p>
          </div>
        </>
      ) : (
        <Sms phone={phone} hideOtpForm={hideOtpForm} />
      )}
    </>
  );
};

export default Register;
