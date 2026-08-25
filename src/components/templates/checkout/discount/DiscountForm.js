"use client";
import React, { useState } from "react";
import styles from "@/styles/checkout.module.css";

function DiscountForm() {
  const [showDiscountForm, setShowDiscountForm] = useState(false);

  return (
    <section className={styles.discount}>
      <div>
        <p>کد تخفیف دارید؟</p>
        <span onClick={() => setShowDiscountForm(true)}>
          برای نوشتن کد اینجا کلیک کنید
        </span>
      </div>
      {showDiscountForm && (
        <div className={styles.discount_container}>
          <p>اگر کد تخفیف دارید لطفا در باکس زیر بنویسید</p>
          <div>
            <input type="text" placeholder="کد تخفیف" />
            <button>اعمال کوپن</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DiscountForm;
