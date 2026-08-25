import Link from "next/link";
import styles from "./card.module.css";

const Card = ({ img, slug, title, description }) => {
  return (
    <div className={styles.card}>
      <Link href={`/article/${slug}`}>
        <img src={img} alt={title} />
      </Link>
      <Link href={`/article/${slug}`} className={styles.title}>
        {title}
      </Link>
      <p className={styles.description}>{description}</p>
      <Link href={`/article/${slug}`}>ادامه مطلب</Link>
    </div>
  );
};

export default Card;
