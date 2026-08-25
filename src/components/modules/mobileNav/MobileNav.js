"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./mobileNav.module.css";
import { FaHome, FaStore, FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const MobileNav = ({ isLogin, isAdmin }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isMobile) return null;

  const navItems = [
    {
      id: "home",
      label: "خانه",
      icon: <FaHome />,
      href: "/",
      active: pathname === "/",
    },
    {
      id: "shop",
      label: "فروشگاه",
      icon: <FaStore />,
      href: "/category?page=1&limit=8",
      active: pathname.startsWith("/category"),
    },
    {
      id: "account",
      label: isLogin ? (isAdmin ? "پیشخوان" : "حساب کاربری") : "ورود / ثبت‌نام",
      icon: isLogin ? <MdDashboard /> : <FaUser />,
      href: isLogin ? "/p-user" : "/login-register",
      active: isLogin
        ? pathname.startsWith("/p-user")
        : pathname.startsWith("/login-register"),
    },
  ];

  return (
    <div className={styles.mobileNav}>
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`${styles.navItem} ${item.active ? styles.active : ""}`}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default MobileNav;
