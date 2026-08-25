"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ticketList.module.css";
import { FaUserCircle, FaCircle, FaClock } from "react-icons/fa";

const TicketList = ({ tickets }) => {
  const pathname = usePathname();

  const getStatusInfo = (ticket) => {
    if (ticket.hasAnswer) {
      return {
        label: "پاسخ داده شده",
        color: "#27ae60",
        icon: <FaCircle size={10} />,
      };
    }
    if (ticket.isClosed) {
      return {
        label: "بسته شده",
        color: "#e74c3c",
        icon: <FaCircle size={10} />,
      };
    }
    return {
      label: "در انتظار پاسخ",
      color: "#f39c12",
      icon: <FaClock size={10} />,
    };
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2> تیکت‌ها</h2>
        <span className={styles.count}>{tickets.length} تیکت</span>
      </div>

      <div className={styles.list}>
        {tickets.map((ticket) => {
          const status = getStatusInfo(ticket);
          const isActive = pathname === `/p-admin/tickets/${ticket._id}`;

          return (
            <Link
              key={ticket._id}
              href={`/p-admin/tickets/${ticket._id}`}
              className={`${styles.ticketItem} ${isActive ? styles.active : ""}`}
            >
              <div className={styles.avatarWrapper}>
                <FaUserCircle size={40} color="#b0a8a0" />
              </div>

              <div className={styles.info}>
                <div className={styles.topRow}>
                  <span className={styles.userName}>{ticket.user.name}</span>
                  <span className={styles.date}>
                    {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
                <div className={styles.bottomRow}>
                  <span className={styles.title}>{ticket.title}</span>
                  <span
                    className={styles.status}
                    style={{ color: status.color }}
                  >
                    {status.icon} {status.label}
                  </span>
                </div>
                <div className={styles.department}>
                  {ticket.department.title} /{" "}
                  {ticket.subDepartment?.title || "عمومی"}
                </div>
              </div>

              {!ticket.hasAnswer && !ticket.isClosed && (
                <span className={styles.unreadDot}></span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default TicketList;
