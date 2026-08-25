"use client";

import React, { useState } from "react";
import styles from "@/components/templates/p-admin/discounts/table.module.css";
import { showSwal } from "@/utils/helper";
import { useRouter } from "next/navigation";

function AddDiscount() {
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [maxUse, setMaxUse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const addDiscount = async (event) => {
    event.preventDefault();
    if (!code || !percent || !maxUse) {
      return showSwal("لطفا تمامی فیلدها را پر کنید", "error", "تلاش مجدد");
    }
    if (percent < 0 || percent > 100) {
      return showSwal("درصد تخفیف باید بین 0 و 100 باشد", "error", "تلاش مجدد");
    }
    if (maxUse < 0) {
      return showSwal(
        "حداکثر استفاده باید بیشتر از 0 باشد",
        "error",
        "تلاش مجدد",
      );
    }

    setIsLoading(true);

    const discount = { code, percent, maxUse };
    try {
      const res = await fetch("/api/discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discount),
      });

      if (res.status == 201) {
        setCode("");
        setPercent("");
        setMaxUse("");
        swal({
          title: "کد تخفیف با موفقیت ایجاد شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => {
          router.refresh();
        });
      }
    } catch (error) {
      showSwal("خطا در ارتباط با سرور", "error", "تلاش مجدد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.discount}>
      <p>افزودن کد تخفیف جدید</p>
      <div className={styles.discount_main}>
        <div>
          <label>شناسه تخفیف</label>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="لطفا شناسه تخفیف را وارد کنید"
            type="text"
          />
        </div>
        <div>
          <label>درصد تخفیف</label>
          <input
            value={percent}
            onChange={(event) => setPercent(event.target.value)}
            placeholder="لطفا درصد تخفیف را وارد کنید"
            type="number"
          />
        </div>
        <div>
          <label>حداکثر استفاده</label>
          <input
            value={maxUse}
            onChange={(event) => setMaxUse(event.target.value)}
            placeholder="حداکثر استفاده از کد تخفیف"
            type="number"
          />
        </div>
        <div>
          <label>محصول</label>
          <select name="" id="">
            <option value="">قهوه ترک</option>
            <option value="">قهوه عربیکا</option>
            <option value="">قهوه اسپرسو</option>
          </select>
        </div>
      </div>
      <button
        onClick={addDiscount}
        className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "در حال افزودن..." : "افزودن"}
      </button>
    </section>
  );
}

export default AddDiscount;
