"use client";
import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import swal from "sweetalert";
import { useRouter, useSearchParams } from "next/navigation";
import EditorWrapper from "@/components/modules/editor/EditorWrapper";

function AddProduct({ mode, product }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [suitableFor, setSuitableFor] = useState("");
  const [smell, setSmell] = useState("");
  const [tags, setTags] = useState("");
  const [stock, setStock] = useState("");
  const [img, setImg] = useState(null);
  const router = useRouter();

  const params = useSearchParams();
  useEffect(() => {
    if (mode == "edit") {
      setName(product?.name || "");
      setPrice(product?.price || "");
      setShortDescription(product?.shortDescription || "");
      setLongDescription(product?.longDescription || "");
      setWeight(product?.weight || "");
      setSuitableFor(product?.suitableFor || "");
      setSmell(product?.smell || "");
      setTags(product?.tags?.join(", ") || "");
      setStock(product?.stock || "");
    }
  }, [params, mode, product]);

  const validateForm = () => {
    if (!name.trim()) {
      swal({
        title: "خطا",
        text: "لطفاً نام محصول را وارد کنید.",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
      swal({
        title: "خطا",
        text: "لطفاً قیمت محصول را به‌صورت یک عدد معتبر وارد کنید.",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    if (!shortDescription.trim()) {
      swal({
        title: "خطا",
        text: "لطفاً توضیحات کوتاه محصول را وارد کنید.",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    if (!longDescription.trim()) {
      swal({
        title: "خطا",
        text: "لطفاً توضیحات بلند محصول را وارد کنید.",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    if (!stock || isNaN(stock) || Number(stock) < 0) {
      swal({
        title: "خطا",
        text: "لطفاً موجودی محصول را به‌صورت یک عدد معتبر وارد کنید.",
        icon: "error",
        buttons: "تایید",
      });
      return false;
    }

    return true;
  };

  const addProduct = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("shortDescription", shortDescription);
    formData.append("longDescription", longDescription);
    formData.append("weight", weight);
    formData.append("suitableFor", suitableFor);
    formData.append("smell", smell);
    formData.append("stock", stock);
    formData.append(
      "tags",
      tags.split("،").filter((tag) => tag.trim() !== "")
    );
    if (img) {
      formData.append("img", img);
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (res.status === 201) {
        swal({
          title: "موفقیت",
          text: "محصول مورد نظر با موفقیت ایجاد شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => {
          setName("");
          setPrice("");
          setShortDescription("");
          setLongDescription("");
          setWeight("");
          setSuitableFor("");
          setSmell("");
          setTags("");
          setStock("");
          setImg(null);
          router.refresh();
        });
      } else if (res.status === 422) {
        const data = await res.json();
        swal({
          title: "خطا",
          text: data.message || "اطلاعات وارد شده صحیح نیست",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      } else {
        swal({
          title: "خطا",
          text: "مشکلی در ایجاد محصول به وجود آمد. لطفاً مجدد تلاش کنید",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      }
    } catch (error) {
      swal({
        title: "خطا",
        text: "خطا در ارتباط با سرور. لطفاً مجدد تلاش کنید",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    }
  };

  const editProduct = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("shortDescription", shortDescription);
    formData.append("longDescription", longDescription);
    formData.append("weight", weight);
    formData.append("suitableFor", suitableFor);
    formData.append("smell", smell);
    formData.append("stock", stock);
    formData.append(
      "tags",
      tags.split("،").filter((tag) => tag.trim() !== "")
    );
    if (img) {
      formData.append("img", img);
    }

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.status === 200) {
        swal({
          title: "موفقیت",
          text: "محصول مورد نظر با موفقیت ویرایش شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => {
          setName("");
          setPrice("");
          setShortDescription("");
          setLongDescription("");
          setWeight("");
          setSuitableFor("");
          setSmell("");
          setTags("");
          setStock("");
          setImg(null);
          router.push("/p-admin/products/");
        });
      } else if (res.status === 422) {
        const data = await res.json();
        swal({
          title: "خطا",
          text: data.message || "اطلاعات وارد شده صحیح نیست",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      } else {
        swal({
          title: "خطا",
          text: "مشکلی در ویرایش محصول به وجود آمد. لطفاً مجدد تلاش کنید",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      }
    } catch (error) {
      swal({
        title: "خطا",
        text: "خطا در ارتباط با سرور. لطفاً مجدد تلاش کنید",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    }
  };

  const cancelEdit = () => {
    setName("");
    setPrice("");
    setShortDescription("");
    setLongDescription("");
    setWeight("");
    setSuitableFor("");
    setSmell("");
    setTags("");
    setStock("");
    setImg(null);
    router.push("/p-admin/products/");
  };

  return (
    <section className={styles.discount}>
      <p className={styles.formTitle}>
        {mode == "edit" ? "ویرایش محصول" : "افزودن محصول جدید"}
      </p>

      <div className={styles.discount_main}>
        {/* ===== نام محصول ===== */}
        <div className={styles.inputGroup}>
          <label>
            نام محصول <span className={styles.requiredStar}>*</span>
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="لطفا نام محصول را وارد کنید"
            type="text"
          />
        </div>

        {/* ===== قیمت ===== */}
        <div className={styles.inputGroup}>
          <label>
            مبلغ محصول <span className={styles.requiredStar}>*</span>
          </label>
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="لطفا مبلغ محصول را وارد کنید"
            type="number"
          />
        </div>

        {/* ===== توضیحات کوتاه ===== */}
        <div className={styles.inputGroup}>
          <label>
            توضیحات کوتاه <span className={styles.requiredStar}>*</span>
          </label>
          <textarea
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            placeholder="توضیحات کوتاه محصول"
            rows="3"
          />
        </div>

        {/* ===== وزن ===== */}
        <div className={styles.inputGroup}>
          <label>وزن</label>
          <input
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="وزن محصول"
            type="text"
          />
        </div>

        {/* ===== مناسب برای ===== */}
        <div className={styles.inputGroup}>
          <label>مناسب برای:</label>
          <input
            value={suitableFor}
            onChange={(event) => setSuitableFor(event.target.value)}
            placeholder="مناسب برای ..."
            type="text"
          />
        </div>

        {/* ===== میزان بو ===== */}
        <div className={styles.inputGroup}>
          <label>میزان بو</label>
          <input
            value={smell}
            onChange={(event) => setSmell(event.target.value)}
            placeholder="میزان بو"
            type="text"
          />
        </div>

        {/* ===== تگ‌ها ===== */}
        <div className={styles.inputGroup}>
          <label>تگ های محصول</label>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="مثال: قهوه،قهوه ترک، قهوه اسپرسو"
            type="text"
          />
        </div>

        {/* ===== موجودی ===== */}
        <div className={styles.inputGroup}>
          <label>
            موجودی <span className={styles.requiredStar}>*</span>
          </label>
          <input
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            placeholder="تعداد موجودی محصول"
            type="number"
            min="0"
          />
        </div>

        {/* ===== تصویر ===== */}
        <div className={styles.inputGroup}>
          <label>تصویر محصول</label>
          <input
            onChange={(event) => setImg(event.target.files[0])}
            type="file"
            accept="image/*"
          />
        </div>
      </div>

      {/* ===== توضیحات بلند ===== */}
      <div className={styles.fullWidth}>
        <label>
          توضیحات بلند <span className={styles.requiredStar}>*</span>
        </label>
        <EditorWrapper value={longDescription} onChange={setLongDescription} />
      </div>

      {mode == "edit" ? (
        <div>
          <button onClick={editProduct} className={styles.submitButton}>
            ویرایش محصول
          </button>
          <button onClick={cancelEdit} className={styles.cancelBtn}>
            انصراف
          </button>
        </div>
      ) : (
        <button onClick={addProduct} className={styles.submitButton}>
          افزودن محصول
        </button>
      )}
    </section>
  );
}

export default AddProduct;