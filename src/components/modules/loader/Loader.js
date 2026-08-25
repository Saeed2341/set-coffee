import styles from "./loader.module.css";

export default function Loader() {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>...در حال بارگذاری</p>
      </div>
    </div>
  );
}
