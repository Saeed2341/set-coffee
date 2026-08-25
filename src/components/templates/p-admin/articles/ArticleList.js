"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./articleList.module.css";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const ArticleList = ({ articles }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
        if (res.status === 200) {
          router.refresh();
        } else {
          swal({ title: "خطا", icon: "error", text: "خطا در حذف مقاله", buttons: "تلاش مجدد" });
        }
      } catch (error) {
        swal({ title: "خطا", icon: "error", text: "خطا در حذف مقاله", buttons: "تلاش مجدد" });
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className={styles.container}>
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

      <div className={styles.tableWrapper}>
        {filteredArticles.length === 0 ? (
          <div className={styles.empty}>
            <p>{searchTerm ? "مقاله‌ای با این جستجو یافت نشد" : "هیچ مقاله‌ای وجود ندارد"}</p>
            {!searchTerm && (
              <Link href="/p-admin/articles/create" className={styles.emptyLink}>
                اولین مقاله را بنویسید
              </Link>
            )}
          </div>
        ) : (
          !isMobile ? (
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
                        {article.tags?.length > 0 && (
                          <div className={styles.tags}>
                            {article.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className={styles.tag}>#{tag}</span>
                            ))}
                            {article.tags.length > 2 && (
                              <span className={styles.tagMore}>+{article.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>{article.author}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>{new Date(article.createdAt).toLocaleDateString("fa-IR")}</td>
                      <td>
                        <div className={styles.actions}>
                          <Link href={`/p-admin/articles/edit/${article._id}`} className={styles.iconBtn} title="ویرایش"><FiEdit2 size={16} /></Link>
                          <span onClick={() => deleteArticle(article._id)} className={`${styles.iconBtn} ${styles.dangerIcon}`} title="حذف"><FiTrash2 size={16} /></span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className={styles.cardsContainer}>
              {filteredArticles.map((article) => {
                const status = getStatusInfo(article.status);
                return (
                  <div key={article._id} className={styles.articleCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardTitle}>{article.title}</span>
                      <span className={`${styles.cardStatus} ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    {article.tags?.length > 0 && (
                      <div className={styles.cardTags}>
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className={styles.cardTag}>#{tag}</span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className={styles.cardTagMore}>+{article.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                    <div className={styles.cardBody}>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>نویسنده:</span>
                        <span>{article.author}</span>
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>تاریخ:</span>
                        <span>{new Date(article.createdAt).toLocaleDateString("fa-IR")}</span>
                      </div>
                    </div>
                    <div className={styles.cardActions}>
                      <Link href={`/p-admin/articles/edit/${article._id}`} className={styles.cardIcon} title="ویرایش"><FiEdit2 size={16} /></Link>
                      <span onClick={() => deleteArticle(article._id)} className={`${styles.cardIcon} ${styles.dangerIcon}`} title="حذف"><FiTrash2 size={16} /></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ArticleList;