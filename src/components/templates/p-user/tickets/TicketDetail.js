"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ticketDetail.module.css";
import { FaUserCircle, FaArrowRight, FaPaperPlane } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helper";

const TicketDetail = ({ ticket, user }) => {
  const router = useRouter();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // ===== اسکرول به انتهای پیام‌ها =====
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.messages]);

  // ===== ارسال پیام جدید =====
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);

    try {
      const res = await fetch(`/api/tickets/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: newMessage,
          ticketID: ticket._id,
        }),
      });

      if (res.status === 201) {
        setNewMessage("");
        router.refresh();
      } else {
        return showSwal("خطا در ارسال پیام", "error", "تلاش مجدد");
      }
    } catch (error) {
      return showSwal("خطا در ارتباط با سرور", "error", "تلاش مجدد");
    } finally {
      return setIsSending(false);
    }
  };

  return (
    <main className={styles.detail}>
      {/* ===== هدر ===== */}
      <div className={styles.header}>
        <span
          className={styles.backBtn}
          onClick={() => router.push("/p-user/tickets")}
        >
          <FaArrowRight size={18} />
        </span>
        <div className={styles.userInfo}>
          <FaUserCircle size={36} color="#b0a8a0" />
          <div>
            <strong>{ticket.title}</strong>
            <span>
              {ticket.department?.title || "عمومی"} /{" "}
              {ticket.subDepartment?.title || "همه"}
            </span>
          </div>
        </div>
        <span className={styles.statusBadge}>
          {ticket.hasAnswer ? "پاسخ داده شده" : "در انتظار پاسخ"}
        </span>
      </div>

      {/* ===== پیام‌ها ===== */}
      <div className={styles.messages}>
        {ticket.messages && ticket.messages.length > 0 ? (
          ticket.messages.map((msg, index) => {
            return (
              <div
                key={index}
                className={`${styles.message} ${!msg.isAnswer ? styles.admin : styles.user}`}
              >
                <div className={styles.bubble}>
                  <div className={styles.meta}>
                    <strong>{msg.sender}</strong>
                    <span suppressHydrationWarning>
                      {new Date(msg.date).toLocaleTimeString("fa-IR")}
                    </span>
                  </div>
                  <p>{msg.body}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.noMessages}>
            <p>هنوز پیامی در این تیکت ارسال نشده است.</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ===== باکس ورودی ===== */}
      <div className={styles.inputBox}>
        <input
          type="text"
          placeholder="پیام خود را وارد کنید..."
          className={styles.input}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isSending}
        />
        <span
          className={styles.sendBtn}
          onClick={sendMessage}
          disabled={isSending}
        >
          <FaPaperPlane size={18} color="#ffffff" />
        </span>
      </div>
    </main>
  );
};

export default TicketDetail;
