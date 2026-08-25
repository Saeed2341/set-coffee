import Link from "next/link";
import styles from "./ticket.module.css";
const Ticket = async ({ _id, title, department, hasAnswer, createdAt }) => {
  return (
    <Link href={`/p-user/tickets/${_id}`} className={styles.ticket}>
      <div>
        <p>{title}</p>
        <p className={styles.department}>{department.title}</p>
      </div>
      <div>
        <p>
          {new Date(createdAt).toLocaleTimeString("fa-IR").slice(0, 5)}{" "}
          {new Date(createdAt).toLocaleDateString("fa-IR")}
        </p>
        {!hasAnswer ? (
          <p className={styles.no_answer}>پاسخ داده نشده</p>
        ) : (
          <p className={styles.answer}>پاسخ داده شده</p>
        )}
      </div>
    </Link>
  );
};

export default Ticket;
