import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Pagination from "@/components/modules/pagination/Pagination";
import Card from "@/components/templates/articles/card/Card";
import styles from "@/styles/articles.module.css";
import ArticleModel from "@/models/Article";
import { authUser } from "@/utils/auth";
import { PiArticleDuotone } from "react-icons/pi";
import MobileNav from "@/components/modules/mobileNav/MobileNav";

const page = async () => {
  const user = await authUser();
  const articles = await ArticleModel.find(
    { status: "published" },
    "title slug description img",
  )
    .sort({ _id: -1 })
    .lean();

  if (!articles.length) return <p>هیچ مقاله ای منتشر نشده است</p>;

  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        isAdmin={user && user.role === "ADMIN" ? true : false}
        userID={user && user._id.toString()}
      />
      <Breadcrumb route={"اخبار و مقالات"} />
      <main data-aos="fade-up" className={styles.container}>
        <div className={styles.articles}>
          {articles.map((article) => (
            <Card key={article._id} {...article} />
          ))}
        </div>
        {/* <Pagination /> */}
      </main>

      <Footer />
           <MobileNav
        isLogin={user ? true : false}
        isAdmin={user?.role == "ADMIN" ? true : false}
      />
    </>
  );
};

export default page;
