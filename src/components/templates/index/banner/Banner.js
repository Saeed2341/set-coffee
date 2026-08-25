"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import styles from "./banner.module.css";

function Banner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className={styles.bannerContainer}>
      {/* عکس ثابت در سمت چپ (فقط دسکتاپ) */}
      {!isMobile && (
        <div className={styles.staticImage}>
          <img src="/images/slider/Untitled-1.jpg" alt="ثابت" />
          <div className={styles.staticText}>
            <h2>کپسول های قهوه</h2>
            <p>سازگار با دستگاه نسپرسو</p>
          </div>
        </div>
      )}
      {/* اسلایدر در سمت راست */}
      <div className={styles.sliderWrapper}>
        <Swiper
          rewind={true}
          navigation={true}
          loop={true}
          autoplay={{ delay: 5000 }}
          modules={[Navigation, Autoplay]}
          className={`${styles.banner} mySwiper`}
          style={{
            "--swiper-navigation-color": "#6d4c41",
            "--swiper-pagination-color": "#a67c52",
          }}
        >
          {isMobile ? (
            // ===== اسلایدهای موبایل =====
            <>
              <SwiperSlide>
                <img
                  src="/images/slider/shop-set-slide-mobile.jpg"
                  alt="فروشگاه قهوه ست"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="/images/slider/gutemala-slide-mobile.jpg"
                  alt="قهوه گواتمالا"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/slider/imgi_303_22.jpg" alt="قهوه گواتمالا" />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="/images/slider/imgi_304_Set-Coffee-Slide-mobile-01.jpg"
                  alt="قهوه گواتمالا"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="/images/slider/imgi_307_Set-Coffee-Slider-Mobile.jpg"
                  alt="قهوه گواتمالا"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/slider/imgi_308_11.jpg" alt="قهوه گواتمالا" />
              </SwiperSlide>
            </>
          ) : (
            // ===== اسلایدهای دسکتاپ =====
            <>
              <SwiperSlide>
                <img
                  src="/images/slider/shop-site-landscape.jpg"
                  alt="فروشگاه قهوه ست"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="/images/slider/Set-Coffee-Slide-01.jpg"
                  alt="فروشگاه قهوه ست"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="/images/slider/SetCoffee-Slider.jpg"
                  alt="فروشگاه قهوه ست"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/slider/3.jpg" alt="فروشگاه قهوه ست" />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="/images/slider/gutemala-slide.jpg"
                  alt="فروشگاه قهوه ست"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/slider/2.jpg" alt="فروشگاه قهوه ست" />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="/images/slider/gutemala-slide.jpg"
                  alt="قهوه گواتمالا"
                />
              </SwiperSlide>
            </>
          )}
        </Swiper>
      </div>
      {/* عکس جایگزین در موبایل (زیر اسلایدر) */}
      {isMobile && (
        <div className={styles.mobileStaticImage}>
          <img src="/images/slider/imgi_309_1920-900.jpg" alt="موبایل" />
        </div>
      )}
    </div>
  );
}

export default Banner;
