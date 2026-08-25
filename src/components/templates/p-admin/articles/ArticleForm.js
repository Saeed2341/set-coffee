"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./articleForm.module.css";
import { FiSave, FiX } from "react-icons/fi";
import EditorWrapper from "@/components/modules/editor/EditorWrapper";

const ArticleForm = ({ article }) => {
  const router = useRouter();
  const isEdit = !!article;

  // ===== stateهای جداگانه برای هر فیلد =====
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setSlug(article.slug || "");
      setDescription(article.description || "");
      setContent(article.content || "");
      setTags(article.tags?.join("، ") || "");
      setStatus(article.status || "draft");
      setAuthor(article.author || "");
    }
  }, [article]);

  // ===== تابع ارسال فرم =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const arrTags = tags.split("، ").filter((tag) => tag.trim() !== "");
    const formData = new FormData();

    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    arrTags.forEach((tag) => formData.append("tags", tag));
    formData.append("status", status);
    formData.append("author", author);
    formData.append("content", content);
    if (img) {
      formData.append("img", img);
    }

    try {
      const url = isEdit ? `/api/articles/${article._id}` : "/api/articles";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.status === 201 || res.status === 200) {
        router.push("/p-admin/articles");
        router.refresh();
      } else {
        const data = await res.json();
        swal({
          title: "خطا",
          icon: "error",
          text: "خطا در ذخیره مقاله",
          buttons: "تلاش مجدد",
        });
      }
    } catch (error) {
      swal({
        title: "خطا",
        icon: "error",
        text: "خطا در ذخیره مقاله",
        buttons: "تلاش مجدد",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isEdit ? "ویرایش مقاله" : "ایجاد مقاله جدید"}
        </h1>
        <Link href="/p-admin/articles" className={styles.backBtn}>
          <FiX size={18} />
          انصراف
        </Link>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* ===== عنوان ===== */}
          <div className={styles.group}>
            <label>
              عنوان مقاله <span>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان مقاله را وارد کنید"
              required
              disabled={isLoading}
            />
          </div>

          {/* ===== اسلاگ ===== */}
          <div className={styles.group}>
            <label>
              اسلاگ (آدرس URL) <span>*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="مثال: types-of-coffee"
              required
              disabled={isLoading}
            />
            <small className={styles.hint}>
              فقط حروف انگلیسی، اعداد و خط تیره مجاز است
            </small>
          </div>

          {/* ===== توضیحات کوتاه ===== */}
          <div className={styles.groupFull}>
            <label>
              توضیحات کوتاه <span>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="خلاصه‌ای از مقاله را وارد کنید"
              rows="3"
              required
              disabled={isLoading}
            />
          </div>

          {/* ===== متن کامل مقاله (با CKEditor) ===== */}
          <div className={styles.groupFull}>
            <label>
              متن کامل مقاله <span>*</span>
            </label>
            <EditorWrapper value={content} onChange={setContent} />
          </div>

          {/* ===== نویسنده ===== */}
          <div className={styles.group}>
            <label>
              نویسنده <span>*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="نام نویسنده"
              required
              disabled={isLoading}
            />
          </div>

          {/* ===== تگ‌ها ===== */}
          <div className={styles.group}>
            <label>تگ‌ها</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="تگ‌ها را با کاما جدا کنید"
              disabled={isLoading}
            />
            <small className={styles.hint}>مثال: قهوه، آموزش، عربیکا</small>
          </div>

          {/* ===== وضعیت ===== */}
          <div className={styles.group}>
            <label>
              وضعیت <span>*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر شده</option>
            </select>
          </div>

          <div className={styles.group}>
            <label>
              تصویر شاخص <span style={{ color: "red" }}>*</span>
            </label>
            <input
              onChange={(event) => setImg(event.target.files[0])}
              type="file"
              accept="image/*"
            />
          </div>
        </div>

        {/* ===== دکمه ارسال ===== */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            <FiSave size={18} />
            {isLoading
              ? "در حال ذخیره..."
              : isEdit
                ? "به‌روزرسانی"
                : "ایجاد مقاله"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
