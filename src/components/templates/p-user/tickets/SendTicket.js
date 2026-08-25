"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/p-user/sendTicket.module.css";
import Link from "next/link";
import { IoIosSend } from "react-icons/io";
import { showSwal } from "@/utils/helper";
function SendTicket() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [priority, setPriority] = useState(1);

  const [departmentID, setDepartmentID] = useState("");
  const [subDepartmentID, setSubDepartmentID] = useState("");
  useEffect(() => {
    const getDepartments = async () => {
      const res = await fetch("/api/departments");
      if (res.status == 200) {
        const data = await res.json();
        setDepartments([...data]);
      }
    };
    getDepartments();
  }, []);

  useEffect(() => {
    if (departmentID != -1) {
      const getSubDepartments = async () => {
        const res = await fetch(`/api/departments/sub/${departmentID}`);
        if (res.status == 200) {
          const data = await res.json();
          setSubDepartments([...data]);
        }
      };
      getSubDepartments();
    } else {
      setSubDepartments([]);
    }
  }, [departmentID]);

  const sendTicket = async () => {
    if (
      !title.trim() ||
      !body.trim() ||
      priority == -1 ||
      departmentID == -1 ||
      subDepartmentID == -1
    ) {
      return showSwal(
        "لطفا همه موارد خواسته شده را تکمیل کنید",
        "error",
        "تلاش مجدد",
      );
    }
    const ticket = {
      title,
      body,
      priority,
      department: departmentID,
      subDepartment: subDepartmentID,
    };

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Types": "application/json",
      },
      body: JSON.stringify(ticket),
    });
    if (res.status == 201) {
      swal({
        title: "تیکت شما با موفقیت ثبت شد",
        icon: "success",
        buttons: "تایید",
      }).then(() => {
        location.replace("/p-user/tickets");
      });
    } else if (res.status == 422) {
      return showSwal(
        "لطفا همه موارد خواسته شده را تکمیل کنید",
        "error",
        "تلاش مجدد",
      );
    }
  };
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        ارسال تیکت جدید
        <Link href="/p-user/tickets"> همه تیکت ها</Link>
      </h1>

      <div className={styles.content}>
        <div className={styles.group}>
          <label>دپارتمان را انتخاب کنید:</label>
          <select onChange={(event) => setDepartmentID(event.target.value)}>
            <option value={-1}>لطفا یک مورد را انتخاب نمایید.</option>

            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.title}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.group}>
          <label>نوع تیکت را انتخاب کنید:</label>
          <select onChange={(event) => setSubDepartmentID(event.target.value)}>
            <option value={-1}>لطفا یک مورد را انتخاب نمایید.</option>

            {subDepartments.map((subDepartment) => (
              <option key={subDepartment._id} value={subDepartment._id}>
                {subDepartment.title}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.group}>
          <label>عنوان تیکت را وارد کنید:</label>
          <input
            placeholder="عنوان..."
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className={styles.group}>
          <label>سطح اولویت تیکت را انتخاب کنید:</label>
          <select onChange={(event) => setPriority(event.target.value)}>
            <option value={-1}>لطفا یک مورد را انتخاب نمایید.</option>
            <option value={1}>کم</option>
            <option value={2}>متوسط</option>
            <option value={3}>بالا</option>
          </select>
        </div>
      </div>
      <div className={styles.group}>
        <label>محتوای تیکت را وارد نمایید:</label>
        <textarea
          rows={10}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        ></textarea>
      </div>
      <div className={styles.uploader}>
        <span>حداکثر اندازه: 6 مگابایت</span>
        <span>فرمت‌های مجاز: jpg, png.jpeg, rar, zip</span>
        <input type="file" />
      </div>

      <button onClick={sendTicket} className={styles.btn}>
        <IoIosSend />
        ارسال تیکت
      </button>
    </main>
  );
}

export default SendTicket;
