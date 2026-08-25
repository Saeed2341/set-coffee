import Link from "next/link";
import styles from "./breadcrumb.module.css";

const Breadcrumb = ({ title }) => {
  return (
    <section className={styles.breadcrumb}>
      <Link href="/">خانه</Link>
      <span>/</span>
      <Link href="/category">همه موارد</Link>
      <span>/</span>
      <p>{title}</p>
    </section>
  );
};

export default Breadcrumb;
