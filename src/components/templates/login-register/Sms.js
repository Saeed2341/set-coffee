import styles from "./sms.module.css";

const Sms = ({ hideOtpForm, phone }) => {
  if (!phone) return;
  swal({
    title: "هشدار!",
    text: "بخش ارسال کد فعلا غیرفعال است",
    icon: "warning",
    buttons: "تایید",
  });
  const sendOtp = () => {
    return swal({
      title: "هشدار!",
      text: "بخش ارسال کد فعلا غیرفعال است",
      icon: "warning",
      buttons: "تایید",
    });
  };
  return (
    <>
      <div className={styles.form} data-aos="fade-up" suppressHydrationWarning>
        {/* ===== دکمه بازگشت (جایگزین لغو) ===== */}
        <button onClick={hideOtpForm} className={styles.back_btn}>
          ← بازگشت
        </button>

        <p>کد تایید</p>
        <span className={styles.code_title}>
          لطفاً کد تأیید ارسال شده را تایپ کنید
        </span>
        <span className={styles.number}>{phone}</span>
        <input className={styles.input} type="text" />
        <button
          onClick={sendOtp}
          style={{ marginTop: "1rem" }}
          className={styles.btn}
        >
          ثبت کد تایید
        </button>
        <p onClick={sendOtp} className={styles.send_again_code}>
          ارسال مجدد کد یکبار مصرف
        </p>
      </div>
    </>
  );
};

export default Sms;
