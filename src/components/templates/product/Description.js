"use client";

import DOMPurify from "isomorphic-dompurify";
import styles from "./description.module.css";

const Description = ({ description }) => {
  const cleanHtml = DOMPurify.sanitize(description);

  return (
    <div className={styles.productDescription}>
      <div
        className={styles.descriptionContent}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
  );
};

export default Description;
