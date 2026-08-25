import React from "react";
import styles from "@/components/templates/product/tabs.module.css";

const MoreInfoes = ({ smell, weight, suitableFor }) => {
  return (
    <div className={styles.moreInfoes}>
      <h3>اطلاعات بیشتر :</h3>
      <hr />
      <main>
        <div>
          <p>وزن</p>
          <p>{weight}</p>
        </div>
        <div>
          <p>مناسب برای</p>
          <p>{suitableFor}</p>
        </div>
        <div>
          <p>میزان بو</p>
          <p>{smell}</p>
        </div>
      </main>
    </div>
  );
};

export default MoreInfoes;
