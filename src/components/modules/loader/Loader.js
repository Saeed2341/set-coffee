"use client";

import styles from "./loader.module.css";
import { FaCoffee } from "react-icons/fa";

export default function Loader() {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
          <FaCoffee className={styles.icon} />
        </div>
        <p className={styles.text}>در حال بارگذاری...</p>
      </div>
    </div>
  );
}