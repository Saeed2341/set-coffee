"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/p-user/dataTable.module.css";
import { FaRegStar, FaStar } from "react-icons/fa";
import Pagination from "@/components/modules/pagination/Pagination";
import { showSwal } from "@/utils/helper";

export default function DataTable({ comments, title }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6  ;

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
            {currentComments.map((comment, index) => (
              <tr key={index}>
                <td>{startIndex + index + 1}</td>
                <td>{new Date(comment.date).toLocaleDateString("fa-IR")}</td>
                <td>{comment.targetId.name}</td>
                {comment.score ? (
                  <td>
                    {new Array(comment.score).fill(0).map((item, idx) => (
                      <FaStar key={idx} />
                    ))}
                    {new Array(5 - comment.score).fill(0).map((item, idx) => (
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
                      comment.status == "accept"
                        ? styles.check
                        : styles.no_check
                    }
                  >
                    {comment.status == "accept"
                      ? comment.hasAnswer
                        ? "پاسخ داده شده"
                        : "تایید شده"
                      : ""}
                    {comment.status == "pending" && "در انتظار تایید"}
                    {comment.status == "reject" && "رد شده"}
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
            ))}
          </tbody>
        </table>
      </div>

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
