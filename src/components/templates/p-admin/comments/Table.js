"use client";
import React, { useState, useEffect } from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helper";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCheck,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMessageSquare,
  FiUserX,
} from "react-icons/fi";
import Pagination from "@/components/modules/pagination/Pagination";

export default function DataTable({
  comments = [],
  title,
  totalPage,
  page,
  currentFilter = "all",
  currentTab = "products",
  searchTerm = "",
}) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState(currentFilter);
  const [activeTab, setActiveTab] = useState(currentTab);
  const [searchValue, setSearchValue] = useState(searchTerm);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setFilterStatus(currentFilter);
    setActiveTab(currentTab);
    setSearchValue(searchTerm);
  }, [currentFilter, currentTab, searchTerm]);

  const buildUrl = (params) => {
    const base = "/p-admin/comments";
    const query = new URLSearchParams();
    query.set("page", params.page || page);
    query.set("limit", 10);
    query.set("status", params.status || filterStatus);
    query.set("tab", params.tab || activeTab);
    if (params.search !== undefined) {
      query.set("search", params.search || "");
    } else {
      query.set("search", searchValue || "");
    }
    return `${base}?${query.toString()}`;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      router.push(buildUrl({ page: newPage }));
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterStatus(value);
    router.push(buildUrl({ status: value, page: 1 }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(buildUrl({ tab, page: 1 }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      router.push(buildUrl({ search: value, page: 1 }));
    }, 400);
  };

  const showCommentBody = (body) => {
    showSwal(body, undefined, "بستن");
  };

  const acceptComment = async (comment) => {
    if (comment.status === "accept") return;
    const res = await fetch("/api/comments/accept", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentID: comment._id }),
    });
    if (res.status === 200) {
      swal({
        title: "موفقیت",
        text: ".کامنت با موفقیت تایید شد",
        icon: "success",
        buttons: "تایید",
      }).then(() => router.refresh());
    }
  };

  const rejectComment = async (comment) => {
    if (comment.status === "reject") return;
    const res = await fetch("/api/comments/reject", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentID: comment._id }),
    });
    if (res.status === 200) {
      swal({
        title: "موفقیت",
        text: ".کامنت با موفقیت رد شد",
        icon: "success",
        buttons: "تایید",
      }).then(() => router.refresh());
    }
  };

  const editComment = async (commentID, body) => {
    if (!commentID) return;
    swal({
      title: "ویرایش",
      text: ":متن جدید را وارد کنید",
      content: {
        element: "input",
        attributes: { value: body, type: "text" },
      },
      buttons: ["انصراف", "ثبت"],
    }).then(async (result) => {
      if (!result) return;
      const res = await fetch(`/api/comments/${commentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: result }),
      });
      if (res.status === 200) {
        swal({
          title: "موفقیت",
          text: ".کامنت با موفقیت ویرایش شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => router.refresh());
      } else {
        swal({
          title: "خطا",
          text: ".مشکلی در ویرایش کامنت به وجود آمد",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      }
    });
  };

  const deleteComment = async (commentID) => {
    if (!commentID) return;
    swal({
      title: "هشدار",
      text: "آیا از حذف این کامنت اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (!result) return;
      const res = await fetch(`/api/comments/${commentID}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        swal({
          title: "موفقیت",
          text: ".کامنت با موفقیت حذف شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => router.refresh());
      } else {
        swal({
          title: "خطا",
          text: ".مشکلی در حذف کامنت به وجود آمد",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      }
    });
  };

  const answerComment = async (targetId, mainComment, targetType) => {
    if (!targetId || !mainComment) return;
    try {
      swal({
        title: "",
        icon: "",
        text: "متن پاسخ را وارد کنید",
        content: "input",
        buttons: ["انصراف", "ثبت"],
      }).then(async (result) => {
        if (!result) return;
        const res = await fetch("/api/comments/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mainComment,
            targetId,
            targetType,
            answer: result,
          }),
        });
        if (res.status === 201) {
          swal({
            title: "موفقیت",
            icon: "success",
            text: "پاسخ با موفقیت ثبت شد",
            buttons: "تایید",
          }).then(() => router.refresh());
        } else {
          swal({
            title: "خطا",
            icon: "error",
            text: "کامنتی یافت نشد",
            buttons: "تلاش مجدد",
          });
        }
      });
    } catch (error) {
      swal({
        title: "خطا",
        icon: "error",
        text: "خطای ناشناس از سمت سرور",
        buttons: "تلاش مجدد",
      });
    }
  };

  const getStatusInfo = (comment) => {
    if (comment.status === "accept") {
      if (comment.hasAnswer) {
        return {
          label: "پاسخ داده شده",
          icon: <FaCheckCircle size={14} />,
          className: styles.statusAccepted,
        };
      }
      return {
        label: "تایید شده",
        icon: <FaCheckCircle size={14} />,
        className: styles.statusAccepted,
      };
    } else if (comment.status === "pending") {
      return {
        label: "در انتظار",
        icon: <FaClock size={14} />,
        className: styles.statusPending,
      };
    } else if (comment.status === "reject") {
      return {
        label: "رد شده",
        icon: <FaTimesCircle size={14} />,
        className: styles.statusRejected,
      };
    }
    return { label: "نامشخص", icon: null, className: "" };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <span
            className={`${styles.tabBtn} ${activeTab === "products" ? styles.tabActive : ""}`}
            onClick={() => handleTabChange("products")}
          >
            محصولات
          </span>
          <span
            className={`${styles.tabBtn} ${activeTab === "articles" ? styles.tabActive : ""}`}
            onClick={() => handleTabChange("articles")}
          >
            مقالات
          </span>
        </div>
        <div className={styles.toolbarActions}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجو..."
              value={searchValue}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterWrapper}>
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="all">همه</option>
              <option value="accept">تایید شده</option>
              <option value="answered">پاسخ داده شده</option>
              <option value="reject">رد شده</option>
              <option value="pending">در انتظار</option>
            </select>
          </div>
        </div>
      </div>

      {comments.length > 0 ? (
        !isMobile ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>کاربر</th>
                  <th>ایمیل</th>
                  <th>عنوان</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => {
                  const status = getStatusInfo(comment);
                  const isAccepted = comment.status === "accept";
                  const isRejected = comment.status === "reject";
                  return (
                    <tr key={comment._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className={styles.userCell}>
                          <span>{comment.username}</span>
                        </div>
                      </td>
                      <td>{comment.email || "—"}</td>
                      <td>
                        <div className={styles.titleCell}>
                          <span className={styles.targetTitle}>
                            {comment.targetType === "Product"
                              ? comment.targetId?.name || "محصول"
                              : comment.targetId?.title || "مقاله"}
                          </span>
                          <span className={styles.targetType}>
                            {comment.targetType === "Product"
                              ? "محصول"
                              : "مقاله"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <span
                            onClick={() => showCommentBody(comment.body)}
                            className={styles.iconBtn}
                            title="مشاهده"
                          >
                            <FiEye size={16} />
                          </span>
                          <span
                            onClick={() =>
                              editComment(comment._id, comment.body)
                            }
                            className={styles.iconBtn}
                            title="ویرایش"
                          >
                            <FiEdit2 size={16} />
                          </span>
                          <span
                            onClick={() => deleteComment(comment._id)}
                            className={`${styles.iconBtn} ${styles.dangerIcon}`}
                            title="حذف"
                          >
                            <FiTrash2 size={16} />
                          </span>
                          <div className={styles.actionDivider} />
                          <span
                            onClick={() => acceptComment(comment)}
                            className={`${styles.iconBtn} ${styles.acceptIcon}`}
                            style={{
                              opacity: isAccepted ? 0.4 : 1,
                              cursor: isAccepted ? "not-allowed" : "pointer",
                            }}
                            title={isAccepted ? "تایید شده" : "تایید"}
                          >
                            <FaCheck size={14} />
                          </span>
                          <span
                            onClick={() => rejectComment(comment)}
                            className={`${styles.iconBtn} ${styles.rejectIcon}`}
                            style={{
                              opacity: isRejected ? 0.4 : 1,
                              cursor: isRejected ? "not-allowed" : "pointer",
                            }}
                            title={isRejected ? "رد شده" : "رد"}
                          >
                            <FaTimes size={14} />
                          </span>
                          <div className={styles.actionDivider} />
                          <span
                            onClick={() =>
                              answerComment(
                                comment.targetId,
                                comment._id,
                                comment.targetType,
                              )
                            }
                            className={`${styles.iconBtn} ${styles.replyIcon}`}
                            title="پاسخ"
                          >
                            <FiMessageSquare size={16} />
                          </span>
                          <span
                            className={`${styles.iconBtn} ${styles.banIcon}`}
                            title="مسدود"
                          >
                            <FiUserX size={16} />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              currentPage={parseInt(page)}
              totalPages={totalPage}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className={styles.cardsContainer}>
            {comments.map((comment) => {
              const status = getStatusInfo(comment);
              const isAccepted = comment.status === "accept";
              const isRejected = comment.status === "reject";
              return (
                <div key={comment._id} className={styles.commentCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardUser}>{comment.username}</span>
                    <span
                      className={`${styles.cardStatus} ${status.className}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>ایمیل:</span>
                      <span>{comment.email || "—"}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>عنوان:</span>
                      <span>
                        {comment.targetType === "Product"
                          ? comment.targetId?.name || "محصول"
                          : comment.targetId?.title || "مقاله"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <span
                      onClick={() => showCommentBody(comment.body)}
                      className={styles.cardIcon}
                      title="مشاهده"
                    >
                      <FiEye size={16} />
                    </span>
                    <span
                      onClick={() => editComment(comment._id, comment.body)}
                      className={styles.cardIcon}
                      title="ویرایش"
                    >
                      <FiEdit2 size={16} />
                    </span>
                    <span
                      onClick={() => deleteComment(comment._id)}
                      className={`${styles.cardIcon} ${styles.dangerIcon}`}
                      title="حذف"
                    >
                      <FiTrash2 size={16} />
                    </span>
                    <div className={styles.actionDivider} />
                    <span
                      onClick={() => acceptComment(comment)}
                      className={`${styles.cardIcon} ${styles.acceptIcon}`}
                      style={{
                        opacity: isAccepted ? 0.4 : 1,
                        cursor: isAccepted ? "not-allowed" : "pointer",
                      }}
                      title={isAccepted ? "تایید شده" : "تایید"}
                    >
                      <FaCheck size={14} />
                    </span>
                    <span
                      onClick={() => rejectComment(comment)}
                      className={`${styles.cardIcon} ${styles.rejectIcon}`}
                      style={{
                        opacity: isRejected ? 0.4 : 1,
                        cursor: isRejected ? "not-allowed" : "pointer",
                      }}
                      title={isRejected ? "رد شده" : "رد"}
                    >
                      <FaTimes size={14} />
                    </span>
                    <div className={styles.actionDivider} />
                    <span
                      onClick={() =>
                        answerComment(
                          comment.targetId,
                          comment._id,
                          comment.targetType,
                        )
                      }
                      className={`${styles.cardIcon} ${styles.replyIcon}`}
                      title="پاسخ"
                    >
                      <FiMessageSquare size={16} />
                    </span>
                    <span
                      className={`${styles.cardIcon} ${styles.banIcon}`}
                      title="مسدود"
                    >
                      <FiUserX size={16} />
                    </span>
                  </div>
                </div>
              );
            })}
            <Pagination
              currentPage={parseInt(page)}
              totalPages={totalPage}
              onPageChange={handlePageChange}
            />
          </div>
        )
      ) : (
        <div className={styles.empty}>
          <p>کامنتی وجود ندارد</p>
        </div>
      )}
    </div>
  );
}
