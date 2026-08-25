import styles from "@/styles/404.module.css";
import Link from "next/link";

const page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>صفحه مورد نظر یافت نشد</h2>
        <p className={styles.description}>
          متاسفیم! صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده است.
        </p>
        <Link href="/" className={styles.homeLink}>
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
};

export default page;