import styles from "./shimmer.module.css";

const ShimmerTable = ({ rows = 5, columns = 6, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className={styles.cardsContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={styles.shimmerCard}>
            <div className={styles.cardHeaderShimmer}>
              <div className={`${styles.shimmerLine} ${styles.shimmerCode}`}></div>
              <div className={`${styles.shimmerLine} ${styles.shimmerStatus}`}></div>
            </div>
            <div className={styles.cardBodyShimmer}>
              <div className={styles.shimmerRow}>
                <div className={`${styles.shimmerLine} ${styles.shimmerLabel}`}></div>
                <div className={`${styles.shimmerLine} ${styles.shimmerValue}`}></div>
              </div>
              <div className={styles.shimmerRow}>
                <div className={`${styles.shimmerLine} ${styles.shimmerLabel}`}></div>
                <div className={`${styles.shimmerLine} ${styles.shimmerValue}`}></div>
              </div>
              <div className={styles.shimmerRow}>
                <div className={`${styles.shimmerLine} ${styles.shimmerLabel}`}></div>
                <div className={`${styles.shimmerLine} ${styles.shimmerValue}`}></div>
              </div>
            </div>
            <div className={`${styles.shimmerLine} ${styles.shimmerButton}`}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.shimmerTable}>
        <thead>
          <tr>
            <th><div className={`${styles.shimmerLine} ${styles.shimmerHeader}`}></div></th>
            <th><div className={`${styles.shimmerLine} ${styles.shimmerHeader}`}></div></th>
            <th><div className={`${styles.shimmerLine} ${styles.shimmerHeader}`}></div></th>
            <th><div className={`${styles.shimmerLine} ${styles.shimmerHeader}`}></div></th>
            <th><div className={`${styles.shimmerLine} ${styles.shimmerHeader}`}></div></th>
            <th><div className={`${styles.shimmerLine} ${styles.shimmerHeader}`}></div></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div
                    className={`${styles.shimmerLine} ${styles.shimmerCell}`}
                    style={{
                      width: colIndex === 0 ? "40px" :
                             colIndex === 1 ? "100px" :
                             colIndex === 2 ? "80px" :
                             colIndex === 3 ? "60px" :
                             colIndex === 4 ? "100px" : "70px",
                    }}
                  ></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShimmerTable;