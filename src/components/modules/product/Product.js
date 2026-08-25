import Link from "next/link";
import styles from "./product.module.css";
import { FaRegStar, FaStar } from "react-icons/fa";
import { RiHeartLine, RiHeartFill, RiSearchLine } from "react-icons/ri";
import WishlistButton from "@/components/templates/product/WishlistButton";

const Card = ({
  _id,
  name,
  score,
  price,
  img,
  shortDescription,
  isInWishlist = false,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.details_container}>
        {img ? (
          <img src={process.env.NEXT_PUBLIC_IMAGE_URL + img} alt={name} />
        ) : (
          <img src="/images/prduct-default-image.png" alt={name} />
        )}
        <div className={styles.icons}>
          <Link href={`/product/${_id}`}>
            <RiSearchLine />
            <p className={styles.tooltip}>مشاهده سریع</p>
          </Link>

          {isInWishlist ? (
            <WishlistButton action="remove" productID={_id.toString()}>
              <RiHeartFill color="red" />
              <p className={styles.tooltip}>حذف از علاقه‌مندی‌ها</p>
            </WishlistButton>
          ) : (
            <WishlistButton action="add" productID={_id.toString()}>
              <RiHeartLine />
              <p className={styles.tooltip}>افزودن به علاقه‌مندی‌ها</p>
            </WishlistButton>
          )}
        </div>
      </div>

      <div className={styles.details}>
        <Link href={`/product/${_id}`}>{name}</Link>
        {/* ===== توضیحات کوتاه ===== */}
        <p className={styles.description}>
          {shortDescription ||
            "قهوه‌ای تازه و باکیفیت، مناسب برای لحظات خاص شما"}
        </p>
        <div>
          {new Array(score).fill(0).map((_, index) => (
            <FaStar key={index} />
          ))}
          {new Array(5 - score).fill(0).map((_, index) => (
            <FaRegStar key={index} />
          ))}
        </div>
        <span>{price.toLocaleString("fa-IR")} تومان</span>
      </div>
    </div>
  );
};

export default Card;
