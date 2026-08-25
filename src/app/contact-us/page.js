// src/app/contact-us/page.js
import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import MobileNav from "@/components/modules/mobileNav/MobileNav";
import Navbar from "@/components/modules/navbar/Navbar";
import Form from "@/components/templates/contact-us/Form";
import Information from "@/components/templates/contact-us/Information";
import MapWrapper from "@/components/templates/contact-us/MapWrapper"; // ✅ ایمپورت جدید
import styles from "@/styles/contact-us.module.css";
import { authUser } from "@/utils/auth";
import Link from "next/link";
const page = async () => {
  const user = await authUser();

  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        isAdmin={user && user.role === "ADMIN" ? true : false}
        userID={user && user._id.toString()}
      />
      <Breadcrumb route={"تماس با ما"} />

      <div className={styles.container}>
        <main data-aos="fade-up" className={styles.maps}>
          <section>
            <MapWrapper
              position={[35.72021225108499, 51.42222691580869]}
              center={[35.72021225108499, 51.42222691580869]}
            >
              <span>فروشگاه ما</span>
              <h3>آدرس فروشگاه حضوری قهوه ست (شعبه جم)</h3>
              <p>
                تهران – خ کریمخان زند – خ قائم مقام فراهانی – ابتدای خ فجر(جم) –
                شماره ۱۰
              </p>
              <p>021-88305827</p>
              <Link href="/about-us">درباره فروشگاه</Link>
            </MapWrapper>
          </section>
          <section>
            <MapWrapper
              position={[35.70153474690238, 51.41497422314844]}
              center={[35.70153474690238, 51.41497422314844]}
            >
              <span>فروشگاه ما</span>
              <h3>آدرس فروشگاه حضوری قهوه ست (شعبه جم)</h3>
              <p>
                تهران – خ کریمخان زند – خ قائم مقام فراهانی – ابتدای خ فجر(جم) –
                شماره ۱۰
              </p>
              <p>021-88305827</p>
              <Link href="/about-us">درباره فروشگاه</Link>
            </MapWrapper>
          </section>
        </main>
      </div>

      <div className={styles.container}>
        <div className={styles.contents}>
          <Form />
          <Information />
        </div>
      </div>

      <Footer />
      <MobileNav
        isLogin={user ? true : false}
        isAdmin={user?.role == "ADMIN" ? true : false}
      />
    </>
  );
};

export default page;
