"use client";

import styles from "./sidebar.module.css";
import { ImReply } from "react-icons/im";
import { FaComments, FaHeart, FaShoppingBag, FaUsers } from "react-icons/fa";
import { MdOutlineAttachMoney, MdLocationOn } from "react-icons/md";
import { MdSms, MdLogout } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import {
  TbArrowRampLeft,
  TbHeart,
  TbHome,
  TbListDetails,
  TbLocation,
  TbMessage,
  TbMessage2Bolt,
  TbPointer2,
  TbShoppingBag,
} from "react-icons/tb";
import Link from "next/link";
import swal from "sweetalert";

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const path = usePathname();
  const router = useRouter();

  const logoutHandler = () => {
    swal({
      title: "آیا از خروج اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/auth/signout", {
          method: "POST",
        });
        if (res.status == 200) {
          swal({
            title: "با موفقیت خارج شدید",
            icon: "success",
            buttons: "تایید",
          }).then(() => {
            router.replace("/");
          });
        }
      }
    });
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebar_open : ""}`}>
      <div className={styles.sidebar_header}>
        <p>پنل کاربری</p>
      </div>
      <ul className={styles.sidebar_main} onClick={onClose}>
        <Link
          href={"/p-user"}
          className={path === "/p-user" ? styles.sidebar_link_active : ""}
        >
          <TbArrowRampLeft />
          پیشخوان
        </Link>
        <Link
          href={"/p-user/orders"}
          className={path.startsWith("/p-user/orders") ? styles.sidebar_link_active : ""}
        >
          <TbShoppingBag />
          سفارش ها
        </Link>
        <Link
          href={"/p-user/tickets"}
          className={path.startsWith("/p-user/tickets") ? styles.sidebar_link_active : ""}
        >
          <TbMessage2Bolt />
          تیکت های پشتیبانی
        </Link>
        <Link
          href={"/p-user/comments"}
          className={path.startsWith("/p-user/comments") ? styles.sidebar_link_active : ""}
        >
          <TbMessage />
          کامنت ها
        </Link>
        <Link
          href={"/p-user/wishlist"}
          className={path.startsWith("/p-user/wishlist") ? styles.sidebar_link_active : ""}
        >
          <TbHeart />
          علاقه مندی
        </Link>
        <Link
          href={"/p-user/addresses"}
          className={path.startsWith("/p-user/addresses") ? styles.sidebar_link_active : ""}
        >
          <TbPointer2 />
          آدرس ها
        </Link>
        <Link
          href={"/p-user/account-details"}
          className={path.startsWith("/p-user/account-details") ? styles.sidebar_link_active : ""}
        >
          <TbListDetails />
          جزئیات اکانت
        </Link>
        <Link
          href={"/"}
          className={path === "/" ? styles.sidebar_link_active : ""}
        >
          <TbHome />
          صفحه اصلی
        </Link>
      </ul>
      <div className={styles.logout} onClick={logoutHandler}>
        <MdLogout />
        خروج
      </div>
    </aside>
  );
};

export default Sidebar;