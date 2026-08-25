"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/p-user/addresses.module.css";
import { validateEmail, validatePhone } from "@/utils/validators";
import swal from "sweetalert";
import stateData from "@/utils/stateData";

const stateOptions = stateData();

const AddressForm = ({ address, onSuccess, onCancel }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    firstname: "",
    lastname: "",
    company: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  const isEdit = !!address;

  useEffect(() => {
    if (address) {
      setFormData({
        nickname: address.nickname || "",
        firstname: address.firstname || "",
        lastname: address.lastname || "",
        company: address.company || "",
        state: address.state || "",
        city: address.city || "",
        address: address.address || "",
        postalCode: address.postalCode || "",
        phone: address.phone || "",
        email: address.email || "",
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = [
      { field: formData.firstname, name: "نام" },
      { field: formData.lastname, name: "نام خانوادگی" },
      { field: formData.state, name: "استان" },
      { field: formData.city, name: "شهر" },
      { field: formData.address, name: "آدرس" },
      { field: formData.postalCode, name: "کد پستی" },
      { field: formData.phone, name: "تلفن" },
      { field: formData.email, name: "ایمیل" },
    ];

    for (const item of required) {
      if (!item.field || item.field.trim() === "") {
        swal({
          title: "خطا",
          text: `فیلد ${item.name} نمی‌تواند خالی باشد`,
          icon: "error",
          buttons: "تایید",
        });
        return false;
      }
    }

    if (!validateEmail(formData.email)) {
      swal({
        title: "خطا",
        text: "ایمیل نامعتبر است",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    if (!validatePhone(formData.phone)) {
      swal({
        title: "خطا",
        text: "شماره تلفن نامعتبر است",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const url = isEdit ? `/api/addresses/${address._id}` : "/api/addresses";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 201 || res.status === 200) {
        const data = await res.json();
        swal({
          title: "موفقیت",
          text: isEdit ? "آدرس با موفقیت ویرایش شد" : "آدرس با موفقیت ایجاد شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => {
          onSuccess(data.address);
        });
      } else if (res.status === 422) {
        const data = await res.json();
        swal({
          title: "خطا",
          text: data.message || "اطلاعات وارد شده صحیح نیست",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      } else {
        swal({
          title: "خطا",
          text: "مشکلی در ذخیره آدرس به وجود آمد",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      }
    } catch (error) {
      swal({
        title: "خطا",
        text: "خطا در ارتباط با سرور",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>
          {isEdit ? "ویرایش آدرس" : "افزودن آدرس جدید"}
        </h2>
        <span onClick={onCancel} className={styles.closeBtn}>
          ✕
        </span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>نام مستعار (اختیاری)</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="مثال: منزل، محل کار"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              نام <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="نام"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              نام خانوادگی <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="نام خانوادگی"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>نام شرکت (اختیاری)</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="نام شرکت"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              استان <span className={styles.requiredStar}>*</span>
            </label>
            <select name="state" value={formData.state} onChange={handleChange}>
              <option value="">انتخاب استان...</option>
              {stateOptions.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>
              شهر <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="شهر"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              آدرس خیابان <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="آدرس کامل"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              کد پستی <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="کد پستی"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              شماره تلفن <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="شماره تلفن"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              ایمیل <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ایمیل"
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={`${styles.submitBtn} ${isLoading ? styles.loading : ""}`}
            disabled={isLoading}
          >
            {isLoading
              ? "در حال ذخیره..."
              : isEdit
                ? "ویرایش آدرس"
                : "افزودن آدرس"}
          </button>
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
