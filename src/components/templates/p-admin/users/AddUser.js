"use client";
import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import swal from "sweetalert";
import { useRouter, useSearchParams } from "next/navigation";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/utils/validators";

function AddUser({ user, mode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (mode == "edit") {
      setName(user?.name);
      setEmail(user?.email);
      setPhone(user?.phone);
      setRole(user?.role);
    }
  }, [params]);

  const validateForm = () => {
    if (!name.trim()) {
      swal({
        title: "خطا",
        text: "لطفاً نام کاربر را وارد کنید.",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    if (!email || !validateEmail(email)) {
      swal({
        title: "خطا",
        text: "لطفاً ایمیل را به‌صورت معتبر وارد کنید.",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    if (!phone || !validatePhone(phone)) {
      swal({
        title: "خطا",
        text: "لطفاً شماره موبایل را به صورت معتبر وارد کنید.",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    if (mode == "create") {
      if (!password || !validatePassword(password)) {
        swal({
          title: "خطا",
          text: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
          icon: "error",
          buttons: "تایید",
        });
        return false;
      }
    }

    if (!role) {
      swal({
        title: "خطا",
        text: "لطفا نقش کاربر را مشخص کنید.",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    return true;
  };

  const editUser = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user._id,
          name,
          email,
          phone,
          role,
        }),
      });

      if (res.status === 200) {
        swal({
          title: "موفقیت",
          text: "کاربر مورد نظر با موفقیت ویرایش شد.",
          icon: "success",
          buttons: "تایید",
        }).then(() => {
          setName("");
          setEmail("");
          setPhone("");
          setRole("USER");
          setIsLoading(false);
          router.replace("/p-admin/users");
        });
      } else if (res.status === 422) {
        const data = await res.json();
        swal({
          title: "خطا",
          text: data.message || "اطلاعات وارد شده صحیح نیست.",
          icon: "error",
          buttons: "تلاش مجدد",
        });
        setIsLoading(false);
      } else if (res.status === 409) {
        const data = await res.json();
        swal({
          title: "خطا",
          text: data.message || "ایمیل یا شماره موبایل قبلاً ثبت شده است.",
          icon: "error",
          buttons: "تلاش مجدد",
        });
        setIsLoading(false);
      } else {
        swal({
          title: "خطا",
          text: "مشکلی در ویرایش کاربر به وجود آمد. لطفاً مجدد تلاش کنید.",
          icon: "error",
          buttons: "تلاش مجدد",
        });
        setIsLoading(false);
      }
    } catch (error) {
      swal({
        title: "خطا",
        text: "خطا در ارتباط با سرور. لطفاً مجدد تلاش کنید.",
        icon: "error",
        buttons: "تلاش مجدد",
      });
      setIsLoading(false);
    }
  };

  const addUser = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
        }),
      });

      if (res.status === 201) {
        swal({
          title: "موفقیت",
          text: "کاربر مورد نظر با موفقیت ایجاد شد.",
          icon: "success",
          buttons: "تایید",
        }).then(() => {
          setName("");
          setEmail("");
          setPhone("");
          setPassword("");
          setRole("USER");
          setIsLoading(false);
          router.refresh();
        });
      } else if (res.status === 422) {
        const data = await res.json();
        swal({
          title: "خطا",
          text: data.message || "اطلاعات وارد شده صحیح نیست.",
          icon: "error",
          buttons: "تلاش مجدد",
        });
        setIsLoading(false);
      } else if (res.status === 409) {
        const data = await res.json();
        swal({
          title: "خطا",
          text: data.message || "ایمیل یا شماره موبایل قبلاً ثبت شده است.",
          icon: "error",
          buttons: "تلاش مجدد",
        });
        setIsLoading(false);
      } else {
        swal({
          title: "خطا",
          text: "مشکلی در ایجاد کاربر به وجود آمد. لطفاً مجدد تلاش کنید.",
          icon: "error",
          buttons: "تلاش مجدد",
        });
        setIsLoading(false);
      }
    } catch (error) {
      swal({
        title: "خطا",
        text: "خطا در ارتباط با سرور. لطفاً مجدد تلاش کنید.",
        icon: "error",
        buttons: "تلاش مجدد",
      });
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRole("USER");
    router.push("/p-admin/users/");
  };

  return (
    <section className={styles.formContainer}>
      <p className={styles.formTitle}>
        {mode == "edit" ? "ویرایش کاربر" : "افزودن کاربر جدید"}
      </p>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label>
            نام کاربر <span className={styles.requiredStar}>*</span>
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="لطفا نام کاربر را وارد کنید"
            type="text"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>
            ایمیل <span className={styles.requiredStar}>*</span>
          </label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="لطفا ایمیل کاربر را وارد کنید"
            type="email"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>
            شماره موبایل <span className={styles.requiredStar}>*</span>
          </label>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="لطفا شماره موبایل کاربر را وارد کنید"
            type="text"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>
            رمز عبور <span className={styles.requiredStar}>*</span>
          </label>
          <input
            disabled={mode == "edit"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="رمز عبور "
            type="password"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>
            نقش کاربر <span className={styles.requiredStar}>*</span>
          </label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="USER">کاربر عادی</option>
            <option value="ADMIN">مدیر</option>
          </select>
        </div>
      </div>

      {mode == "edit" ? (
        <div>
          <button
            className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
            onClick={editUser}
            disabled={isLoading}
          >
            {isLoading ? "در حال ویرایش..." : "ویرایش کاربر"}
          </button>
          <button onClick={cancelEdit} className={styles.cancelBtn}>
            انصراف
          </button>
        </div>
      ) : (
        <button
          className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
          onClick={addUser}
          disabled={isLoading}
        >
          {isLoading ? "در حال افزودن..." : "افزودن کاربر"}
        </button>
      )}
    </section>
  );
}

export default AddUser;
