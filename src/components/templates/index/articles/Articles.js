"use client";
import styles from "./articles.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import Article from "./Article";

const Articles = ({ articles }) => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>مقالات ما</p>
      <span className={styles.description}>دانستنی های جذاب دنیای قهوه</span>
      <main>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          dir="rtl"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          navigation={true}
          modules={[Navigation, Autoplay]}
          className={`${styles.articles_slider} mySwiper articles_slider`}
          breakpoints={{
            // وقتی عرض صفحه >= 768px (تبلت)
            768: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
            // وقتی عرض صفحه >= 1024px (دسکتاپ)
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {articles.map((article) => (
            <SwiperSlide>
              <Article key={article._id} {...article} />
            </SwiperSlide>
          ))}
        </Swiper>
      </main>
    </div>
  );
};

export default Articles;
