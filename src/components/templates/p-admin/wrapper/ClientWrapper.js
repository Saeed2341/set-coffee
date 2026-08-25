"use client";

import { useState } from "react";
import styles from "./clientWrapper.module.css";
import Sidebar from "@/components/modules/p-admin/Sidebar";
import Topbar from "@/components/modules/p-admin/Topbar";
import MobileNav from "@/components/modules/mobileNav/MobileNav";

const ClientWrapper = ({ adminName, children }) => {
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
        <Topbar
          adminName={adminName}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
        />
        {children}
      </div>
      <MobileNav isLogin={true} isAdmin={true} />
    </>
  );
};

export default ClientWrapper;
