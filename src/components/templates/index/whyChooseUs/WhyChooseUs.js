"use client";

import React from "react";
import styles from "./whyChooseUs.module.css";
import { FaTruck, FaShieldAlt, FaHeadset, FaAward } from "react-icons/fa";
import { GiCoffeeBeans } from "react-icons/gi";
import { MdVerified } from "react-icons/md";

const whyChooseData = [
  {
    id: 1,
    icon: <FaTruck />,
    title: "ارسال سریع و رایگان",
    description: "ارسال سفارشات در سریع‌ترین زمان ممکن و رایگان برای خرید‌های بالای ۵۰۰ هزار تومان",
  },
  {
    id: 2,
    icon: <GiCoffeeBeans />,
    title: "قهوه‌های تازه و باکیفیت",
    description: "انتخاب بهترین دانه‌های قهوه از مزارع معتبر و برشته‌کاری روزانه برای تازگی بین‌نظیر",
  },
  {
    id: 3,
    icon: <FaShieldAlt />,
    title: "ضمانت اصالت و کیفیت",
    description: "همه محصولات ما دارای ضمانت اصالت و کیفیت بوده و با خیال راحت خرید کنید",
  },
  {
    id: 4,
    icon: <FaHeadset />,
    title: "پشتیبانی ۲۴ ساعته",
    description: "تیم پشتیبانی ما آماده پاسخگویی به سوالات و مشکلات شما در تمام ساعات شبانه‌روز",
  },
  {
    id: 5,
    icon: <MdVerified />,
    title: "ضمانت بازگشت وجه",
    description: "در صورت عدم رضایت از محصول، امکان بازگشت وجه تا ۷ روز برای شما فراهم است",
  },
  {
    id: 6,
    icon: <FaAward />,
    title: "عضویت در انجمن قهوه اروپا",
    description: "مجموعه قهوه‌ست عضو رسمی انجمن تخصصی قهوه اروپا (SCAE) از سال ۲۰۰۷",
  },
];

const WhyChooseUs = () => {
  return (
    <section className={styles.why_choose} data-aos="fade-up" suppressHydrationWarning>
      <div className={styles.container}>
        {/* ===== هدر بخش ===== */}
        <div className={styles.header}>
          <span className={styles.badge}>مزایای خرید از ما</span>
          <h2 className={styles.title}>چرا قهوه‌ست را انتخاب کنیم؟</h2>
          <p className={styles.subtitle}>
            ما در قهوه‌ست به کیفیت، تازگی و رضایت مشتریان خود افتخار می‌کنیم.
            همین حالا به جمع دوستداران قهوه باکیفیت بپیوندید.
          </p>
        </div>

        {/* ===== لیست مزایا ===== */}
        <div className={styles.grid}>
          {whyChooseData.map((item) => (
            <div key={item.id} className={styles.card} data-aos="fade-up" data-aos-delay={item.id * 50} suppressHydrationWarning>
              <div className={styles.icon_wrapper}>{item.icon}</div>
              <h3 className={styles.card_title}>{item.title}</h3>
              <p className={styles.card_description}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;