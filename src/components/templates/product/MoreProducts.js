"use client";
import Product from "@/components/modules/product/Product";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import styles from "@/styles/product.module.css";

const MoreProducts = ({ relatedProducts }) => {
  return (
    <div className={styles.moreProducts} data-aos="fade-right" suppressHydrationWarning>
      <section>
        <h2>محصولات مرتبط</h2>
        <div className={styles.divider}></div>
      </section>
      <Swiper
        slidesPerView={1}          // ← مقدار پیش‌فرض برای موبایل
        spaceBetween={16}
        dir="rtl"
        rewind={true}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        breakpoints={{
          // ===== تبلت =====
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // ===== دسکتاپ کوچک =====
          768: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          // ===== دسکتاپ بزرگ =====
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
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