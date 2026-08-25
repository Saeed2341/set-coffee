import { MdOutlineSms } from "react-icons/md";
import styles from "./article.module.css";
import { IoShareSocialOutline } from "react-icons/io5";
import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPinterest,
  FaTelegram,
  FaTwitter,
  FaUserCircle,
} from "react-icons/fa";

const Card = ({ title, img, author, slug, createdAt, tags }) => {
  return (
    <div className={styles.card}>
      <Link className={styles.img_container} href={`/article/${slug}`}>
        <img src={img} alt={title} />
      </Link>
      <div className={styles.date}>
        <span>{new Date(createdAt).toLocaleDateString("fa-IR")}</span>
        {/* <span>بهمن</span> */}
      </div>
      <div className={styles.details}>
        <span className={styles.tag}>{tags.slice(0, 2).join(", ")}</span>
        <Link href={`/article/${slug}`} className={styles.title}>
          {title}
        </Link>
        <div>
          <FaUserCircle size={20} />
          <p>نویسنده:</p>
          <p>{author}</p>
          <div>
            <MdOutlineSms />
            <span>0</span>
          </div>
          <div className={styles.share}>
            <IoShareSocialOutline />
            <div className={styles.tooltip}>
              <Link href={"/"}>
                <FaTelegram />
              </Link>
              <Link href={"/"}>
                <FaLinkedinIn />
              </Link>
              <Link href={"/"}>
                <FaPinterest />
              </Link>
              <Link href={"/"}>
                <FaTwitter />
              </Link>
              <Link href={"/"}>
                <FaFacebookF />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
