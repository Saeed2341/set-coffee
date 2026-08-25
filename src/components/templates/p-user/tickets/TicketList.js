"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ticketList.module.css";
import { FaUserCircle, FaCircle, FaClock, FaPlus } from "react-icons/fa";

const TicketList = ({ tickets }) => {
  const pathname = usePathname();

  const getStatusInfo = (ticket) => {
    const lastMessage = ticket.messages?.[ticket.messages.length - 1];
    if (lastMessage?.isAnswer) {
      return {
        label: "پاسخ داده شده",
        color: "#27ae60",
        icon: <FaCircle size={10} />,
      };
    }
    if (ticket.hasAnswer) {
      return {
        label: "پاسخ داده شده",
        color: "#27ae60",
        icon: <FaCircle size={10} />,
      };
    }
    return {
      label: "در انتظار پاسخ",
      color: "#f39c12",
      icon: <FaClock size={10} />,
    };
  };

  const getLastMessage = (ticket) => {
    if (!ticket.messages || ticket.messages.length === 0) return "بدون پیام";
    const last = ticket.messages[ticket.messages.length - 1];
    return last.body.length > 40 ? last.body.slice(0, 40) + "..." : last.body;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2>تیکت‌ها</h2>
        <Link href="/p-user/tickets/new" className={styles.newTicketBtn}>
          <FaPlus size={14} />
          جدید
        </Link>
      </div>

      <div className={styles.list}>
        {tickets.length === 0 ? (
          <div className={styles.emptyList}>
            <p>هیچ تیکتی وجود ندارد</p>
            <Link href="/p-user/tickets/new" className={styles.emptyLink}>
              اولین تیکت را ثبت کنید
            </Link>
          </div>
        ) : (
          tickets.map((ticket) => {
            const status = getStatusInfo(ticket);
            const isActive = pathname === `/p-user/tickets/${ticket._id}`;

            return (
              <Link
                key={ticket._id}
                href={`/p-user/tickets/${ticket._id}`}
                className={`${styles.ticketItem} ${isActive ? styles.active : ""}`}
              >
                <div className={styles.avatarWrapper}>
                  <FaUserCircle size={40} color="#b0a8a0" />
                </div>

                <div className={styles.info}>
                  <div className={styles.topRow}>
                    <span className={styles.title}>{ticket.title}</span>
                    <span className={styles.date}>
                      {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  <div className={styles.bottomRow}>
                    <span className={styles.lastMessage}>
                      {getLastMessage(ticket)}
                    </span>
                    <span
                      className={styles.status}
                      style={{ color: status.color }}
                    >
                      {status.icon} {status.label}
                    </span>
                  </div>
                  <div className={styles.department}>
                    {ticket.department?.title || "عمومی"}
                  </div>
                </div>

                {ticket.messages &&
                  ticket.messages.length > 0 &&
                  !ticket.messages[ticket.messages.length - 1]?.isAnswer && (
                    <span className={styles.unreadDot}></span>
                  )}
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default TicketList;
