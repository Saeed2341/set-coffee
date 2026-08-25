"use client";

import styles from "./topbar.module.css";
import { IoIosSearch, IoIosNotifications } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
const Topbar = ({ adminName, toggleMenu, isMenuOpen }) => {
  return (
    <div className={styles.topbar}>
      <div className={styles.left_section}>
        <span
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="منو"
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </span>
        <div className={styles.profile}>
          <div>
            <p>{adminName}</p>
            <span>ادمین</span>
          </div>
          <FaUserCircle size={44} color="#6d4c41" />
        </div>
      </div>
      <section>
        <div className={styles.searchBox}>
          <input type="text" placeholder="جستجو کنید" />
          <div>
            <IoIosSearch />
          </div>
        </div>
        <div className={styles.notification}>
          <IoIosNotifications />
          <span>2</span>
        </div>
      </section>
    </div>
  );
};

export default Topbar;
