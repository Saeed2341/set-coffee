"use client";
import Product from "@/components/modules/product/Product";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import styles from "@/styles/product.module.css"; // اضافه کردن import

const MoreProducts = ({ relatedProducts }) => {
  return (
    <div className={styles.moreProducts} data-aos="fade-right" suppressHydrationWarning>
      <section>
        <h2>محصولات مرتبط</h2>
        <div className={styles.divider}></div>
      </section>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        dir="rtl"
        rewind={true}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {relatedProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <Product {...product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MoreProducts;