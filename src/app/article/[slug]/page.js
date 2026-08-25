import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Comment from "@/components/templates/article/comment/Comment";
import Details from "@/components/templates/article/details/Details";
import styles from "@/styles/article.module.css";
import { redirect } from "next/navigation";
import ArticleModel from "@/models/Article";
import { authUser } from "@/utils/auth";
import MobileNav from "@/components/modules/mobileNav/MobileNav";
const page = async ({ params }) => {
  const user = await authUser();

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const article = await ArticleModel.findOne(
    { slug },
    "title img description  content  createdAt  author tags",
  );

  if (!article) return redirect("/articles");
  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        isAdmin={user && user.role === "ADMIN" ? true : false}
        userID={user && user._id.toString()}
      />
      <Breadcrumb route={slug.replaceAll("-", " ")} />
      <div className={styles.container}>
        <Details article={JSON.parse(JSON.stringify(article))} />
        <Comment articleID={JSON.parse(JSON.stringify(article._id))} />
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
