"use client";

import { useState } from "react";
import styles from "./topbar.module.css";
import { IoIosSearch, IoIosNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import Modal from "./Modal";

const Topbar = ({ toggleMenu, isMenuOpen, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const hideModal = () => setShowModal(false);

  return (
    <>
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
              <p>{user.name}</p>
              <span>{user.role == "ADMIN" ? "ادمین" : "کاربر"}</span>
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
          <div
            onClick={() => setShowNotifications(true)}
            className={styles.notification}
          >
            <IoIosNotifications />
            <span>0</span>
          </div>
        </section>
      </div>

      {showNotifications && (
        <div>
          <div
            onClick={() => setShowNotifications(false)}
            className={styles.notifications_overlay}
          ></div>
          <section className={styles.notifications_box}>
            <div>
              <p
                onClick={() => {
                  setShowNotifications(false);
                  setShowModal(true);
                }}
              >
                سلام ادمین محترم
              </p>
              <button onClick={() => setShowNotifications(false)}>دیدم</button>
            </div>
            <div>
              <p
                onClick={() => {
                  setShowNotifications(false);
                  setShowModal(true);
                }}
              >
                سلام ادمین محترم
              </p>
              <button onClick={() => setShowNotifications(false)}>دیدم</button>
            </div>
          </section>
        </div>
      )}
      {showModal && (
        <Modal title="از واحد پشتیبانی" hideModal={hideModal}>
          <p className={styles.modal_text}>عالی هستی ادمین عزیز</p>
        </Modal>
      )}
    </>
  );
};

export default Topbar;
