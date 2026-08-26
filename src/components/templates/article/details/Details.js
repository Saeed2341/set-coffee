import Link from "next/link";
import sanitize from "sanitize-html";
import {
  FaAngleLeft,
  FaAngleRight,
  FaFacebookF,
  FaLinkedinIn,
  FaPinterest,
  FaTelegram,
  FaTwitter,
  FaUserCircle,
} from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";
import styles from "./details.module.css";
const Details = ({ article }) => {
  // پاک‌سازی محتوای HTML با sanitize-html
  const cleanHtml = sanitize(article.content, {
    allowedTags: [
      "p",
      "br",
      "b",
      "i",
      "u",
      "strong",
      "em",
      "strike",
      "code",
      "sub",
      "sup",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "span",
      "div",
      "blockquote",
      "pre",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["style", "class", "id"],
    },
    allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
  });

  return (
    <>
      <p className={styles.tag}>{article.tags.join(", ")}</p>
      <p className={styles.title}>{article.title}</p>
      <div className={styles.author}>
        <p>نویسنده</p>
        <FaUserCircle size={22} color="#6d4c41" />
        <p>{article.author}</p>
      </div>
      <div className={styles.description}>{article.description}</div>
      <div className={styles.main_img}>
        <div className={styles.date}>
          <span>{new Date(article.createdAt).toLocaleDateString("fa-IR")}</span>
        </div>
        <img src={article.img} alt={article.title} />
      </div>

      <section
        className={styles.descriptionContent}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />

      <div className={styles.contents}>
        <div className={styles.icons}>
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
        <div className={styles.more_articles}>
          <div className={styles.prev_article}>
            <Link href={"/article/134"} className={styles.icon}>
              <FaAngleLeft />
            </Link>
            <div>
              <p>قدیمی تر</p>
              <Link href={"/article/134"}>
                مصرف قهوه با شیر برای کاهش التهاب
              </Link>
            </div>
          </div>

          <Link className={styles.link} href={"/articles"}>
            <IoGridOutline />
          </Link>

          <div className={styles.next_article}>
            <Link href={"/article/134"} className={styles.icon}>
              <FaAngleRight />
            </Link>
            <div>
              <p>جدید تر</p>
              <Link href={"/article/134"}>کاهش افسردگی و اضطراب با قهوه</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
