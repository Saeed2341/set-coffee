"use client";
import { useEffect, useState, useRef } from "react"; // ✅ اضافه کردن useRef
import styles from "./order.module.css";
import { showSwal } from "@/utils/helper";

const Order = ({ handleSubmit }) => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  const [isAcceptedRules, setIsAcceptedRules] = useState(false);

  // ============================================
  // 🛡️ تغییر مهم: اضافه کردن state برای جلوگیری از کلیک‌های تکراری
  // ============================================
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false); // ✅ قفل محکم‌تر با useRef

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);
  }, []);

  useEffect(() => {
    let price = 0;
    if (cart.length) {
      price = cart.reduce(
        (prev, current) => prev + current.price * current.count,
        0,
      );
    }
    setTotalPrice(price);
  }, [cart]);

  const applyDiscount = async (code) => {
    if (!code || !code.length) {
      showSwal("لطفا کد تخفیف را وارد کنید", "error", "تلاش مجدد");
      return false;
    }

    try {
      const res = await fetch("/api/discounts/use", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (res.status === 404) {
        showSwal("کد تخفیف یافت نشد", "error", "تلاش مجدد");
        return false;
      }
      if (res.status === 422) {
        showSwal(
          "کد تخفیف منقضی شده یا تعداد استفاده به پایان رسیده",
          "error",
          "تلاش مجدد",
        );
        return false;
      }

      const discountData = await res.json();
      const percent = discountData.percent;
      const discountAmountValue = (totalPrice * percent) / 100;
      const newPrice = totalPrice - discountAmountValue;

      setDiscountPercent(percent);
      setDiscountAmount(discountAmountValue);
      setTotalPrice(newPrice);
      setIsDiscountApplied(true);
      setDiscountCode(discountData.code);
      setShowDiscountInput(false);

      showSwal(`کد تخفیف با موفقیت اعمال شد (${percent}%)`, "success", "تایید");
      return true;
    } catch (error) {
      console.error("Error applying discount:", error);
      showSwal("خطا در اعمال کد تخفیف", "error", "تلاش مجدد");
      return false;
    }
  };

  const handleDiscountSubmit = async () => {
    if (isDiscountApplied) {
      return showSwal("کد تخفیف قبلاً اعمال شده است", "error", "تایید");
    }
    await applyDiscount(discountCode);
  };

  // ============================================
  // 🛡️ تغییر مهم: تابع جدید برای ارسال سفارش با قفل
  // ============================================
  const handleOrderSubmit = async () => {
    // ✅ اگر قبلاً در حال ارسال است یا قفل فعال است، کاری نکن
    if (submitLockRef.current || isSubmitting) {
      return;
    }

    // ✅ قفل را فعال کن
    submitLockRef.current = true;
    setIsSubmitting(true);

    try {
      // ✅ ارسال داده‌ها به والد
      await handleSubmit(cart, discountCode, isDiscountApplied);
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      // ✅ بعد از اتمام، قفل را آزاد کن (با کمی تاخیر برای جلوگیری از کلیک مجدد)
      setTimeout(() => {
        submitLockRef.current = false;
        setIsSubmitting(false);
      }, 1000); // ۱ ثانیه تاخیر
    }
  };

  const shippingCost = 30000;
  const taxRate = 0.009;
  const taxAmount = Math.round(totalPrice * taxRate);
  const finalPrice = totalPrice + shippingCost + taxAmount;

  return (
    <div className={styles.order}>
      <p className={styles.title}>سفارش شما</p>

      <main className={styles.main}>
        {/* هدر */}
        <div>
          <p>جمع جزء</p>
          <p>محصول</p>
        </div>

        {/* آیتم‌های سبد خرید */}
        {cart.length
          ? cart.map((item) => (
              <div key={item.id}>
                <p>{item.price.toLocaleString("fa-IR")} تومان</p>
                <p className={styles.product_name}>
                  {item.name} × {item.count}
                </p>
              </div>
            ))
          : null}

        {/* جمع جزء */}
        <div>
          <p>{totalPrice.toLocaleString("fa-IR")} تومان</p>
          <p>جمع جزء</p>
        </div>

        {/* نمایش تخفیف (در صورت اعمال) */}
        {isDiscountApplied && discountAmount > 0 && (
          <div style={{ color: "#6d4c41", fontWeight: 600 }}>
            <p>
              - {discountAmount.toLocaleString("fa-IR")} تومان (
              {discountPercent}%)
            </p>
            <p>تخفیف</p>
          </div>
        )}

        {/* حمل و نقل */}
        <div>
          <p>
            پیک موتوری:{" "}
            <strong>{shippingCost.toLocaleString("fa-IR")} تومان</strong>
          </p>
          <p>حمل و نقل</p>
        </div>

        {/* مالیات */}
        <div>
          <p>{taxAmount.toLocaleString("fa-IR")} تومان</p>
          <p>مالیات (ارزش افزوده)</p>
        </div>

        {/* مجموع کل */}
        <div>
          <div>
            <h2>{finalPrice.toLocaleString("fa-IR")} تومان</h2>
            <p>
              (شامل <strong>{taxAmount.toLocaleString("fa-IR")}</strong> تومان
              ارزش افزوده)
            </p>
          </div>
          <h3>مجموع</h3>
        </div>
      </main>

      {/* ===== بخش کد تخفیف (تاگل‌شونده) ===== */}
      <div className={styles.discountSection}>
        <p
          className={styles.discountToggle}
          onClick={() => setShowDiscountInput(!showDiscountInput)}
        >
          {isDiscountApplied
            ? "✓ کد تخفیف اعمال شد"
            : "آیا کد تخفیف دارید؟ کلیک کنید"}
        </p>

        {showDiscountInput && !isDiscountApplied && (
          <div className={styles.discountBox}>
            <div className={styles.discountInput}>
              <input
                type="text"
                placeholder="کد تخفیف را وارد کنید"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                autoFocus
              />
              <button onClick={handleDiscountSubmit} disabled={!discountCode}>
                اعمال
              </button>
            </div>
          </div>
        )}

        {isDiscountApplied && (
          <p className={styles.discountApplied}>
            ✓ کد تخفیف با موفقیت اعمال شد
          </p>
        )}
      </div>

      {/* ===== بخش پرداخت ===== */}
      <div className={styles.transaction}>
        <div>
          <input
            type="radio"
            name="payment_method"
            value="melli"
            defaultChecked
          />
          <label>بانک ملی</label>
          <img
            width={40}
            height={40}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3oiNfASJb0ljgIaa_3VG1rQdyoPyejzr7uS8bvUSRlA&s"
            alt="بانک ملی"
          />
        </div>

        <div>
          <input type="radio" name="payment_method" value="zarinpal" />
          <label>پرداخت امن زرین پال</label>
          <img
            width={40}
            height={40}
            src="https://set-coffee.com/wp-content/plugins/zarinpal-woocommerce-payment-gateway/assets/images/logo.png"
            alt="زرین پال"
          />
        </div>

        <div className={styles.paymentBox}>
          <p>
            پرداخت امن به وسیله کلیه کارت های عضو شتاب از طریق درگاه زرین پال
          </p>
        </div>

        <div className={styles.warning}>
          <p>
            اطلاعات شخصی شما برای پردازش سفارش و پشتیبانی از تجربه شما در این
            وبسایت و برای اهداف دیگری که در{" "}
            <strong>سیاست حفظ حریم خصوصی</strong> توضیح داده شده است استفاده
            می‌شود.
          </p>
        </div>

        <div className={styles.accept_rules}>
          <input
            type="checkbox"
            onChange={(e) => setIsAcceptedRules(e.target.checked)}
            checked={isAcceptedRules}
            name="accept_rules"
            id="accept_rules"
          />
          <p>
            من <strong>شرایط و مقررات</strong> سایت را خوانده ام و آن را می
            پذیرم. <span>*</span>
          </p>
        </div>

        {/* ============================================
          🛡️ تغییر مهم: دکمه ثبت سفارش با قفل
        ============================================ */}
        <button
          onClick={handleOrderSubmit}
          className={styles.submit}
          disabled={!isAcceptedRules || isSubmitting || submitLockRef.current}
          style={{
            opacity: !isAcceptedRules || isSubmitting ? 0.6 : 1,
            cursor:
              !isAcceptedRules || isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "...در حال ثبت سفارش" : "ثبت سفارش"}
        </button>
      </div>
    </div>
  );
};

export default Order;
