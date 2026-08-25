"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./createTicket.module.css";
import { IoIosSend } from "react-icons/io";
import { showSwal } from "@/utils/helper";

const CreateTicket = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [priority, setPriority] = useState(1);
  const [departmentID, setDepartmentID] = useState("");
  const [subDepartmentID, setSubDepartmentID] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ===== دریافت دپارتمان‌ها =====
  useEffect(() => {
    const getDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        if (res.status === 200) {
          const data = await res.json();
          setDepartments(data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    getDepartments();
  }, []);

  // ===== دریافت زیردپارتمان‌ها =====
  useEffect(() => {
    if (departmentID && departmentID !== "-1") {
      const getSubDepartments = async () => {
        try {
          const res = await fetch(`/api/departments/sub/${departmentID}`);
          if (res.status === 200) {
            const data = await res.json();
            setSubDepartments(data);
          }
        } catch (error) {
          console.error("Error fetching sub-departments:", error);
        }
      };
      getSubDepartments();
    } else {
      setSubDepartments([]);
      setSubDepartmentID("");
    }
  }, [departmentID]);

  // ===== ارسال تیکت =====
  const createTicket = async (e) => {
    e.preventDefault();

    // ===== اعتبارسنجی =====
    if (!title.trim()) {
      return showSwal("لطفاً عنوان تیکت را وارد کنید", "error", "تلاش مجدد");
    }

    if (!departmentID || departmentID === "-1") {
      return showSwal("لطفاً دپارتمان را انتخاب کنید", "error", "تلاش مجدد");
    }
    if (!subDepartmentID || subDepartmentID === "-1") {
      return showSwal("لطفاً نوع تیکت را انتخاب کنید", "error", "تلاش مجدد");
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          department: departmentID,
          subDepartment: subDepartmentID,
          priority: Number(priority),
        }),
      });

      if (res.status === 201) {
        const data = await res.json();
        swal({
          title: "تیکت با موفقیت ایجاد شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => {
          // ===== هدایت به صفحه تیکت‌ها =====
          router.push("/p-user/tickets");
        });
      } else if (res.status === 422) {
        const data = await res.json();
        showSwal(
          data.message || "اطلاعات وارد شده صحیح نیست",
          "error",
          "تلاش مجدد",
        );
      } else {
        showSwal("خطا در ایجاد تیکت", "error", "تلاش مجدد");
      }
    } catch (error) {
      showSwal("خطا در ارتباط با سرور", "error", "تلاش مجدد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ایجاد تیکت جدید</h1>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/p-user/tickets")}
        >
          ← بازگشت به لیست تیکت‌ها
        </button>
      </div>

      <form onSubmit={createTicket} className={styles.form}>
        <div className={styles.formGrid}>
          {/* ===== عنوان ===== */}
          <div className={styles.group}>
            <label>
              عنوان تیکت <span>*</span>
            </label>
            <input
              type="text"
              placeholder="عنوان تیکت را وارد کنید..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* ===== دپارتمان ===== */}
          <div className={styles.group}>
            <label>
              دپارتمان <span>*</span>
            </label>
            <select
              value={departmentID}
              onChange={(e) => setDepartmentID(e.target.value)}
              disabled={isLoading}
            >
              <option value="-1">انتخاب دپارتمان...</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.title}
                </option>
              ))}
            </select>
          </div>

          {/* ===== زیردپارتمان ===== */}
          <div className={styles.group}>
            <label>
              نوع تیکت <span>*</span>
            </label>
            <select
              value={subDepartmentID}
              onChange={(e) => setSubDepartmentID(e.target.value)}
              disabled={!departmentID || departmentID === "-1" || isLoading}
            >
              <option value="-1">انتخاب نوع تیکت...</option>
              {subDepartments.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.title}
                </option>
              ))}
            </select>
          </div>

          {/* ===== اولویت ===== */}
          <div className={styles.group}>
            <label>
              سطح اولویت <span>*</span>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isLoading}
            >
              <option value="1">کم</option>
              <option value="2">متوسط</option>
              <option value="3">بالا</option>
            </select>
          </div>
        </div>

        {/* ===== دکمه ارسال ===== */}
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          <IoIosSend size={20} />
          {isLoading ? "...در حال ارسال" : "ارسال تیکت"}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
