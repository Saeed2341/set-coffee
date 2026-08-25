// components/modules/comment/Comment.jsx
import { FaRegStar, FaStar, FaUserCircle } from "react-icons/fa";
import styles from "./comment.module.css";

const Comment = ({ username, body, score, date, isAnswer = false }) => {
  return (
    <section className={`${styles.comment} `}>
      <FaUserCircle className={styles.avatar} size={60} color="#b0a8a0" />
      <div>
        <div className={styles.main_details}>
          <div className={styles.user_info}>
            <strong>{username}</strong>
            <p>{new Date(date).toLocaleDateString("fa-IR")}</p>
          </div>
          {!isAnswer && (
            <div className={styles.stars}>
              {Array(score)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} />
                ))}
              {Array(5 - score)
                .fill(0)
                .map((_, i) => (
                  <FaRegStar key={i} />
                ))}
            </div>
          )}
        </div>
        <p>{body}</p>
      </div>
    </section>
  );
};

export default Comment;
