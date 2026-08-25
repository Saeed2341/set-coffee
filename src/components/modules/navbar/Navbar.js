"use client";
import React, { useEffect, useState } from "react";
import styles from "./Nabvar.module.css";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { FaShoppingCart, FaRegHeart } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar({ isLogin, isAdmin, userID }) {
  const [wishCount, setWishCount] = useState();
  const [cartCount, setCartCount] = useState();
  const [fixTop, setFixTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getWishlistCount();
    getCartCount();

    const fixNavbarToTop = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 105) {
        setFixTop(true);
      } else {
        setFixTop(false);
      }
    };
    window.addEventListener("scroll", fixNavbarToTop);
    return () => window.removeEventListener("scroll", fixNavbarToTop);
  }, []);

  const getWishlistCount = async () => {
    if (!userID) return;
    const res = await fetch(`/api/wishlist/${userID}`);
    if (res.status == 200) {
      const data = await res.json();
      setWishCount(data.wishlistCount);
    }
  };

  const getCartCount = async () => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCartCount(JSON.parse(cart).length);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={fixTop ? styles.navbar_fixed : styles.navbar}>
      <main>
        <span
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="منو"
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </span>

        <div className={styles.logo_wrapper}>
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" />
          </Link>
        </div>

        <div className={styles.navbar_icons}>
          <Link href="/cart">
            <FaShoppingCart />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
          <Link href="/wishlist">
            <FaRegHeart />
            {wishCount > 0 && <span>{wishCount}</span>}
          </Link>
        </div>

        <ul
          className={`${styles.links} ${isMenuOpen ? styles.links_open : ""}`}
        >
          <li>
            <Link href="/" onClick={closeMenu}>
              صفحه اصلی
            </Link>
          </li>
          <li>
            <Link href="/category?page=1&limit=9" onClick={closeMenu}>
              فروشگاه
            </Link>
          </li>
          <li>
            <Link href="/articles" onClick={closeMenu}>
              وبلاگ
            </Link>
          </li>
          <li>
            <Link href="/contact-us" onClick={closeMenu}>
              تماس با ما
            </Link>
          </li>
          <li>
            <Link href="/about-us" onClick={closeMenu}>
              درباره ما
            </Link>
          </li>
          <li>
            <Link href="/rules" onClick={closeMenu}>
              قوانین
            </Link>
          </li>

          {!isLogin ? (
            <li>
              <Link href="/login-register" onClick={closeMenu}>
                ورود / عضویت
              </Link>
            </li>
          ) : (
            <div className={styles.dropdown}>
              <Link href="#">
                <IoIosArrowDown className={styles.dropdown_icons} />
                حساب کاربری
              </Link>
              <div className={styles.dropdown_content}>
                {isAdmin && (
                  <Link href="/p-admin" onClick={closeMenu}>
                    پنل مدیریت
                  </Link>
                )}
                <Link href="/p-user" onClick={closeMenu}>
                  پیشخوان
                </Link>
                <Link href="/p-user/orders" onClick={closeMenu}>
                  سفارشات
                </Link>
                <Link href="/p-user/tickets" onClick={closeMenu}>
                  تیکت های پشتیبانی
                </Link>
                <Link href="/p-user/comments" onClick={closeMenu}>
                  کامنت‌ها
                </Link>
                <Link href="/p-user/wishlist" onClick={closeMenu}>
                  علاقه‌مندی‌ها
                </Link>
                <Link href="/p-user/account-details" onClick={closeMenu}>
                  جزئیات اکانت
                </Link>
              </div>
            </div>
          )}
        </ul>
      </main>
    </nav>
  );
}

export default Navbar;
