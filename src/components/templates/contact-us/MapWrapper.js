"use client";

import dynamic from "next/dynamic";
import styles from "./map.module.css";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <span>در حال بارگذاری نقشه...</span>
    </div>
  ),
});

const MapWrapper = ({ position, center, children }) => {
  return (
    <Map position={position} center={center}>
      {children}
    </Map>
  );
};

export default MapWrapper;
