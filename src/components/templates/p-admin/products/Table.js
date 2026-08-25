"use client";
import React, { useState, useEffect } from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import { FiEye, FiEdit2, FiTrash2, FiSearch, FiPackage, FiTag } from "react-icons/fi";

export default function DataTable({ products, title }) {
  const router = useRouter();
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

  // ===== فیلتر کردن محصولات بر اساس نام و تگ‌ها =====
  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const tagsMatch = product.tags?.some(tag =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return nameMatch || tagsMatch;
  });

  const deleteProduct = async (productID) => {
    swal({
      title: "هشدار",
      text: "آیا از حذف محصول اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (!result) return;

      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productID }),
      });

      if (res.status == 200) {
        return swal({
          title: "موفقیت",
          text: "محصول با موفقیت حذف شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => {
          router.refresh();
        });
      } else {
        return swal({
          title: "خطا",
          text: "مشکلی در حذف محصول به وجود آمد",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      }
    });
  };

  // ===== وضعیت موجودی =====
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "ناموجود", className: styles.outOfStock };
    if (stock < 5) return { label: "موجودی کم", className: styles.lowStock };
    return { label: "موجود", className: styles.inStock };
  };

  return (
    <div className={styles.container}>
      {/* ===== هدر با عنوان + جستجو ===== */}
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="جستجوی محصول یا تگ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* ===== در دسکتاپ: نمایش جدول ===== */}
      {!isMobile && (
        filteredProducts.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>شناسه</th>
                  <th>تصویر</th>
                  <th>نام محصول</th>
                  <th>وزن</th>
                  <th>موجودی</th>
                  <th>قیمت</th>
                  <th>امتیاز</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td>
                        {product.img ? (
                          <img
                            src={`/uploads/${product.img}`}
                            width={50}
                            height={50}
                            className={styles.productImage}
                            alt={product.name}
                          />
                        ) : (
                          <img
                            src={"/images/prduct-default-image.png"}
                            width={50}
                            height={50}
                            className={styles.productImage}
                            alt={product.name}
                          />
                        )}
                      </td>
                      <td className={styles.nameCell}>
                        <span className={styles.productName}>{product.name}</span>
                        {product.tags?.length > 0 && (
                          <div className={styles.tags}>
                            {product.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className={styles.tag}>#{tag}</span>
                            ))}
                            {product.tags.length > 3 && (
                              <span className={styles.tagMore}>+{product.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>{product.weight ? `${product.weight}g` : "-"}</td>
                      <td>
                        <span className={`${styles.stockBadge} ${stockStatus.className}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td>{product.price.toLocaleString("fa-IR")}</td>
                      <td>{product.score.toLocaleString("fa-IR")}</td>
                      <td>
                        <div className={styles.actions}>
                          <span
                            onClick={() => router.push(`/product/${product._id}`)}
                            className={styles.iconBtn}
                            title="جزئیات محصول"
                          >
                            <FiEye size={16} />
                          </span>
                          <span
                            onClick={() => router.push(`/p-admin/products?mode=edit&id=${product._id}`)}
                            className={styles.iconBtn}
                            title="ویرایش"
                          >
                            <FiEdit2 size={16} />
                          </span>
                          <span
                            onClick={() => deleteProduct(product._id)}
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
          </div>
        ) : (
          <div className={styles.empty}>
            <p>{searchTerm ? "محصولی با این جستجو یافت نشد" : "هیچ محصولی وجود ندارد"}</p>
          </div>
        )
      )}

      {/* ===== در موبایل: نمایش کارت ===== */}
      {isMobile && (
        filteredProducts.length > 0 ? (
          <div className={styles.cardsContainer}>
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div key={product._id} className={styles.productCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardId}>#{product._id.slice(-6)}</span>
                    <span className={`${styles.cardStock} ${stockStatus.className}`}>
                      {stockStatus.label}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardImageWrapper}>
                      {product.img ? (
                        <img
                          src={`/uploads/${product.img}`}
                          width={70}
                          height={70}
                          className={styles.cardImage}
                          alt={product.name}
                        />
                      ) : (
                        <img
                          src={"/images/prduct-default-image.png"}
                          width={70}
                          height={70}
                          className={styles.cardImage}
                          alt={product.name}
                        />
                      )}
                      <div className={styles.cardInfo}>
                        <span className={styles.cardName}>{product.name}</span>
                        {product.tags?.length > 0 && (
                          <div className={styles.cardTags}>
                            {product.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className={styles.cardTag}>#{tag}</span>
                            ))}
                            {product.tags.length > 2 && (
                              <span className={styles.cardTagMore}>+{product.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardDetails}>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>وزن:</span>
                        <span>{product.weight ? `${product.weight}g` : "-"}</span>
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>قیمت:</span>
                        <span className={styles.cardPrice}>{product.price.toLocaleString("fa-IR")} تومان</span>
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>امتیاز:</span>
                        <span>{product.score.toLocaleString("fa-IR")}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <span
                      onClick={() => router.push(`/product/${product._id}`)}
                      className={styles.cardIcon}
                      title="جزئیات محصول"
                    >
                      <FiEye size={16} />
                    </span>
                    <span
                      onClick={() => router.push(`/p-admin/products?mode=edit&id=${product._id}`)}
                      className={styles.cardIcon}
                      title="ویرایش"
                    >
                      <FiEdit2 size={16} />
                    </span>
                    <span
                      onClick={() => deleteProduct(product._id)}
                      className={`${styles.cardIcon} ${styles.dangerIcon}`}
                      title="حذف"
                    >
                      <FiTrash2 size={16} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>{searchTerm ? "محصولی با این جستجو یافت نشد" : "هیچ محصولی وجود ندارد"}</p>
          </div>
        )
      )}
    </div>
  );
}