"use client";

import styles from "./sidebar.module.css";
import { ImReply } from "react-icons/im";
import {
  FaComments,
  FaHeart,
  FaShoppingBag,
  FaUsers,
  FaHome,
  FaNewspaper,
} from "react-icons/fa";
import { MdOutlineAttachMoney, MdSms, MdLogout, MdHome } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { GiPayMoney } from "react-icons/gi";
import { usePathname, useRouter } from "next/navigation";
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
        <p>پنل مدیریت</p>
      </div>
      <ul className={styles.sidebar_main} onClick={onClose}>
        <Link
          href={"/p-admin"}
          className={path === "/p-admin" ? styles.sidebar_link_active : ""}
        >
          <ImReply />
          پیشخوان
        </Link>
        <Link
          href={"/p-admin/products"}
          className={
            path === "/p-admin/products" ? styles.sidebar_link_active : ""
          }
        >
          <FaShoppingBag />
          محصولات
        </Link>
        <Link
          href={"/p-admin/orders"}
          className={
            path === "/p-admin/orders" ? styles.sidebar_link_active : ""
          }
        >
          <TbListDetails />
          سفارشات
        </Link>
        <Link
          href={"/p-admin/transactions"}
          className={
            path === "/p-admin/transactions" ? styles.sidebar_link_active : ""
          }
        >
          <MdOutlineAttachMoney />
          تراکنش‌ها
        </Link>
        <Link
          href={"/p-admin/users"}
          className={
            path === "/p-admin/users" ? styles.sidebar_link_active : ""
          }
        >
          <FaUsers />
          کاربران
        </Link>
        <Link
          href={"/p-admin/comments"}
          className={
            path === "/p-admin/comments" ? styles.sidebar_link_active : ""
          }
        >
          <FaComments />
          کامنت ها
        </Link>
        <Link
          href={"/p-admin/tickets"}
          className={
            path === "/p-admin/tickets" ? styles.sidebar_link_active : ""
          }
        >
          <MdSms />
          تیکت ها
        </Link>
        <Link
          href={"/p-admin/articles"}
          className={
            path.includes("/p-admin/articles") ? styles.sidebar_link_active : ""
          }
        >
          <FaNewspaper />
          مقالات
        </Link>
        <Link
          href={"/p-admin/discounts"}
          className={
            path === "/p-admin/discounts" ? styles.sidebar_link_active : ""
          }
        >
          <MdOutlineAttachMoney />
          تخفیفات
        </Link>
        <Link href={"/"}>
          <FaHome />
          صفحه اصلی
        </Link>
      </ul>
      <div className={styles.sidebar_footer}>
        <div className={styles.logout} onClick={logoutHandler}>
          <MdLogout />
          خروج
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
