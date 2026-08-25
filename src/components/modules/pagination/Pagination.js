// components/modules/pagination/Pagination.jsx
import styles from "./pagination.module.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage >= 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage <= totalPages) onPageChange(Number(currentPage) + 1);
  };

  return (
    <div className={styles.pagination}>
      <ul>
        <MdChevronRight
          onClick={handlePrev}
          className={currentPage <= 1 ? styles.disabled : ""}
        />

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <li
            key={num}
            className={num == currentPage ? styles.active : ""}
            onClick={() => onPageChange(num)}
          >
            {num}
          </li>
        ))}

        <MdChevronLeft
          onClick={handleNext}
          className={currentPage >= totalPages ? styles.disabled : ""}
        />
      </ul>
    </div>
  );
};

export default Pagination;
