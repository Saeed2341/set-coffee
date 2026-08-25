"use client";

import styles from "./ticketDetail.module.css";
import { FaUserCircle, FaPaperPlane, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { showSwal } from "@/utils/helper";

const TicketDetail = ({ ticket }) => {
  const router = useRouter();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.messages]);

  const messages = ticket.messages;

  const sendAnswer = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/tickets/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketID: ticket._id, body: newMessage }),
      });
      if (res.status == 201) {
        setNewMessage("");
        router.refresh();
      } else if (res.status == 422) {
        return showSwal("شناسه تیکت نامعتبر است", "error", "تایید");
      }
    } catch (error) {
      return showSwal("خطا در سمت سرور!", "error", "تایید");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <main className={styles.detail}>
      {/* ===== هدر ===== */}
      <div className={styles.header}>
        <span
          className={styles.backBtn}
          onClick={() => router.push("/p-admin/tickets")}
        >
          <FaArrowRight size={18} />
        </span>
        <div className={styles.userInfo}>
          <FaUserCircle size={36} color="#b0a8a0" />
          <div>
            <strong>{ticket.user.name}</strong>
            <span>
              {ticket.department.title} /{" "}
              {ticket.subDepartment?.title || "عمومی"}
            </span>
          </div>
        </div>
        <span className={styles.statusBadge}>
          {ticket.hasAnswer ? "پاسخ داده شده" : "در انتظار پاسخ"}
        </span>
      </div>

      {/* ===== پیام‌ها ===== */}
      <div className={styles.messages}>
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => {
            return (
              <div
                key={index}
                className={`${styles.message} ${msg.isAnswer ? styles.admin : styles.user}`}
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
          placeholder="پاسخ خود را وارد کنید..."
          className={styles.input}
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
          disabled={isSending}
        />
        <span
          onClick={sendAnswer}
          className={styles.sendBtn}
          disabled={isSending}
        >
          <FaPaperPlane size={18} />
        </span>
      </div>
    </main>
  );
};

export default TicketDetail;
