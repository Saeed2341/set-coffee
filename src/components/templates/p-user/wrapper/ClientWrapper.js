"use client";

import { useState } from "react";
import styles from "./clientWrapper.module.css";
import Sidebar from "@/components/modules/p-user/Sidebar";
import Topbar from "@/components/modules/p-user/Topbar";
import MobileNav from "@/components/modules/mobileNav/MobileNav";

const ClientWrapper = ({ children, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* ===== اوورلی ===== */}
      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.overlay_open : ""}`}
        onClick={closeMenu}
      ></div>

      {/* ===== سایدبار با props ===== */}
      <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />

      <div className={styles.contents}>
        {/* ===== توپبار با props ===== */}
        <Topbar user={user} toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
        {children}
      </div>
      <MobileNav
        isLogin={user ? true : false}
        isAdmin={user?.role == "ADMIN" ? true : false}
      />
    </>
  );
};

export default ClientWrapper;
