"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./articleList.module.css";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const ArticleList = ({ articles }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ===== فیلتر کردن مقالات بر اساس عنوان و نویسنده =====
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusInfo = (status) => {
    if (status === "published") {
      return { label: "منتشر شده", className: styles.statusPublished };
    }
    return { label: "پیش‌نویس", className: styles.statusDraft };
  };

  const deleteArticle = async (id) => {
    if (!id) return;
    swal({
      title: "هشدار",
      icon: "warning",
      text: "آیا از حذف این مقاله اطمینان دارید؟",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (!result) return;
      setDeletingId(id);
      try {
        const res = await fetch(`/api/articles/${id}`, {
          method: "DELETE",
        });
        if (res.status === 200) {
          router.refresh();
        } else {
          swal({
            title: "خطا",
            icon: "error",
            text: "خطا در حذف مقاله",
            buttons: "تلاش مجدد",
          });
        }
      } catch (error) {
        swal({
          title: "خطا",
          icon: "error",
          text: "خطا در حذف مقاله",
          buttons: "تلاش مجدد",
        });
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* ===== هدر ===== */}
      <div className={styles.header}>
        <h1 className={styles.title}>مدیریت مقالات</h1>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجوی مقاله..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <Link href="/p-admin/articles/create" className={styles.createBtn}>
            <FiPlus size={18} />
            مقاله جدید
          </Link>
        </div>
      </div>

      {/* ===== جدول ===== */}
      <div className={styles.tableWrapper}>
        {filteredArticles.length === 0 ? (
          <div className={styles.empty}>
            <p>
              {searchTerm
                ? "مقاله‌ای با این جستجو یافت نشد"
                : "هیچ مقاله‌ای وجود ندارد"}
            </p>
            {!searchTerm && (
              <Link href="/p-admin/articles/create" className={styles.emptyLink}>
                اولین مقاله را بنویسید
              </Link>
            )}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>عنوان</th>
                <th>نویسنده</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => {
                const status = getStatusInfo(article.status);
                return (
                  <tr key={article._id}>
                    <td className={styles.titleCell}>
                      <span className={styles.titleText}>{article.title}</span>
                      {/* ===== هشتگ‌ها (برگشت داده شده) ===== */}
                      {article.tags?.length > 0 && (
                        <div className={styles.tags}>
                          {article.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className={styles.tag}>
                              #{tag}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className={styles.tagMore}>
                              +{article.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td>{article.author}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td>
                      {new Date(article.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        {/* ===== ویرایش ===== */}
                        <Link
                          href={`/p-admin/articles/edit/${article._id}`}
                          className={styles.iconBtn}
                          title="ویرایش"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        {/* ===== حذف ===== */}
                        <span
                          onClick={() => deleteArticle(article._id)}
                          className={`${styles.iconBtn} ${styles.dangerIcon}`}
                          title="حذف"
                        >
                          <FiTrash2 size={16} />
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ArticleList;