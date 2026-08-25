"use client";
import React from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helper";
export default function DataTable({ tickets, title }) {
  const router = useRouter();

  const showTicketBody = (body) => {
    if (!body.trim()) {
      return showSwal("متنی یافت نشد", "error", "تایید");
    }

    return showSwal(body, "", "بستن");
  };

  const answerToTicket = (ticket) => {
    swal({
      title: "لطفا پاسخ مورد نظر خود را وارد کنید:",
      content: "input",
      buttons: "ثبت",
    }).then(async (result) => {
      if (!result) return;

      const answer = {
        title: ticket.title,
        body: result,
        department: ticket.department._id,
        subDepartment: ticket.subDepartment._id,
        priority: ticket.priority,
        mainTicketID: ticket._id,
      };
      const res = await fetch("/api/tickets/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answer),
      });
      if (res.status == 201) {
        showSwal("پاسخ شما ارسال شد", "success", "تایید");
        router.refresh();
      }
    });
  };

  const banUser = async (userEmail, userPhone) => {
    swal({
      title: "از این عمل اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch(`/api/user/ban`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail, phone: userPhone }),
        });

        if (res.status == 201) {
          return swal({
            title: "کاربر با موفقیت مسدود شد",
            icon: "success",
            buttons: "تایید",
          }).then(() => {
            router.refresh();
          });
        } else if (res.status == 200) {
          return swal({
            title: "کاربر با موفقیت آزاد شد",
            icon: "success",
            buttons: "تایید",
          }).then(() => {
            router.refresh();
          });
        }
      }
    });
  };

  return (
    <div>
      <div>
        <h1 className={styles.title}>
          <span>{title}</span>
        </h1>
      </div>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>کاربر</th>
              <th>عنوان</th>
              <th>دپارتمان</th>
              <th>مشاهده</th>
              <th>پاسخگویی</th>
              <th>مسدود</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <td>{index + 1}</td>
                <td>{ticket.user.name}</td>
                <td>{ticket.title}</td>
                <td>{ticket.department.title}</td>
                <td>
                  <button
                    onClick={() => showTicketBody(ticket.body)}
                    type="button"
                    className={styles.edit_btn}
                  >
                    مشاهده
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => answerToTicket(ticket)}
                    type="button"
                    disabled={ticket.hasAnswer}
                    className={styles.delete_btn}
                  >
                    {ticket.hasAnswer ? "پاسخ داده شده" : "پاسخ"}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      banUser(ticket.user.email, ticket.user.phone)
                    }
                    type="button"
                    className={styles.delete_btn}
                  >
                    مسدود
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
