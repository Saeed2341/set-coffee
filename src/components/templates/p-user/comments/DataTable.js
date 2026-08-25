"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/p-user/dataTable.module.css";
import { FaRegStar, FaStar } from "react-icons/fa";
import Pagination from "@/components/modules/pagination/Pagination";
import { showSwal } from "@/utils/helper";

export default function DataTable({ comments, title }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [comments]);

  const totalPages = Math.ceil(comments.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComments = comments.slice(startIndex, endIndex);

  const showCommentBody = (commentBody) => {
    showSwal(commentBody, undefined, "تایید");
  };

  const getStatusInfo = (comment) => {
    if (comment.status === "accept") {
      return comment.hasAnswer
        ? { label: "پاسخ داده شده", className: styles.statusAnswered }
        : { label: "تایید شده", className: styles.statusAccepted };
    }
    if (comment.status === "pending") {
      return { label: "در انتظار تایید", className: styles.statusPending };
    }
    if (comment.status === "reject") {
      return { label: "رد شده", className: styles.statusRejected };
    }
    return { label: "نامشخص", className: styles.statusUnknown };
  };

  if (!comments || comments.length === 0) {
    return (
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.empty}>کامنتی وجود ندارد</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className={styles.title}>{title}</h1>
      </div>

      {/* ===== در دسکتاپ: نمایش جدول ===== */}
      {!isMobile ? (
        <div className={styles.table_container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>شناسه</th>
                <th>تاریخ</th>
                <th>محصول</th>
                <th>امتیاز</th>
                <th>وضعیت</th>
                <th>مشاهده</th>
              </tr>
            </thead>
            <tbody>
              {currentComments.map((comment, index) => {
                const statusInfo = getStatusInfo(comment);
                return (
                  <tr key={index}>
                    <td>{startIndex + index + 1}</td>
                    <td>{new Date(comment.date).toLocaleDateString("fa-IR")}</td>
                    <td>{comment.targetId.name}</td>
                    {comment.score ? (
                      <td>
                        {new Array(comment.score)
                          .fill(0)
                          .map((item, idx) => (
                            <FaStar key={idx} />
                          ))}
                        {new Array(5 - comment.score)
                          .fill(0)
                          .map((item, idx) => (
                            <FaRegStar key={idx} />
                          ))}
                      </td>
                    ) : (
                      <td>_</td>
                    )}
                    <td>
                      <button
                        type="button"
                        className={
                          comment.status === "accept"
                            ? styles.check
                            : styles.no_check
                        }
                      >
                        {statusInfo.label}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => showCommentBody(comment.body)}
                        className={styles.btn}
                      >
                        مشاهده
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* ===== در موبایل: نمایش کارت ===== */
        <div className={styles.cardsContainer}>
          {currentComments.map((comment, index) => {
            const statusInfo = getStatusInfo(comment);
            return (
              <div key={index} className={styles.commentCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardId}>#{startIndex + index + 1}</span>
                  <span
                    className={`${styles.cardStatus} ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>تاریخ:</span>
                    <span>{new Date(comment.date).toLocaleDateString("fa-IR")}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>محصول:</span>
                    <span>{comment.targetId.name}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>امتیاز:</span>
                    <span className={styles.cardStars}>
                      {comment.score ? (
                        <>
                          {new Array(comment.score)
                            .fill(0)
                            .map((item, idx) => (
                              <FaStar key={idx} size={12} />
                            ))}
                          {new Array(5 - comment.score)
                            .fill(0)
                            .map((item, idx) => (
                              <FaRegStar key={idx} size={12} />
                            ))}
                        </>
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showCommentBody(comment.body)}
                  className={styles.cardBtn}
                >
                  مشاهده متن کامنت
                </button>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}