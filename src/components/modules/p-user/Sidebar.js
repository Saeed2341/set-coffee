"use client";

import styles from "./sidebar.module.css";
import { ImReply } from "react-icons/im";
import { FaComments, FaHeart, FaShoppingBag, FaUsers } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { MdSms, MdLogout } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import {
  TbArrowRampLeft,
  TbHeart,
  TbHome,
  TbListDetails,
  TbMessage,
  TbMessage2Bolt,
  TbShoppingBag,
} from "react-icons/tb";
import Link from "next/link";
import swal from "sweetalert";

const Sidebar = ({  isOpen = false, onClose = () => {} }) => {
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
        <Link href={"/p-user"} className={styles.sidebar_link_active}>
          <TbArrowRampLeft />
          پیشخوان
        </Link>
        <Link href={"/p-user/orders"}>
          <TbShoppingBag />
          سفارش ها
        </Link>
        <Link href={"/p-user/tickets"}>
          <TbMessage2Bolt />
          تیکت های پشتیبانی
        </Link>
        <Link href={"/p-user/comments"}>
          <TbMessage />
          کامنت ها
        </Link>
        <Link href={"/p-user/wishlist"}>
          <TbHeart />
          علاقه مندی
        </Link>
        <Link href={"/p-user/account-details"}>
          <TbListDetails />
          جزئیات اکانت
        </Link>
        <Link href={"/"}>
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
