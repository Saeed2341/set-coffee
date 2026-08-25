"use client";
import styles from "./product.module.css";
import Link from "next/link";
import { FaRegStar } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Card = ({ img, productID, price, score, name }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const removeProduct = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/wishlist/${productID}`, {
        method: "DELETE",
      });

      if (res.status == 200) {
        swal({
          title: "محصول با موفقیت از لیست علاقه‌مندی‌ها حذف شد",
          icon: "success",
          buttons: "تایید",
        }).then(() => {
          router.refresh();
        });
      } else {
        swal({
          title: "خطا در حذف محصول",
          icon: "error",
          buttons: "تایید",
        });
      }
    } catch (error) {
      swal({
        title: "خطا در ارتباط با سرور",
        icon: "error",
        buttons: "تایید",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <Link href={`/product/${productID}`}>
        <img width={283} height={283} src={img} alt="" />
      </Link>
      <p dir="rtl">{name}</p>
      <div>
        <div>
          {new Array(score).fill(0).map((item, index) => (
            <IoMdStar key={index} />
          ))}
          {new Array(5 - score).fill(0).map((item, index) => (
            <FaRegStar key={index} />
          ))}
        </div>
        <span>{price.toLocaleString("fa-IR")} تومان</span>
      </div>
      <button
        onClick={removeProduct}
        className={`${styles.delete_btn} ${isLoading ? styles.loading : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "در حال حذف..." : "حذف محصول"}
      </button>
    </div>
  );
};

export default Card;
