import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Articles from "@/components/templates/index/articles/Articles";
import Banner from "@/components/templates/index/banner/Banner";
import Latest from "@/components/templates/index/latest/Latest";
import Newsletter from "@/components/templates/index/newsletter/Newsletter";
import Promote from "@/components/templates/index/promote/Promote";
import WhyChooseUs from "@/components/templates/index/whyChooseUs/WhyChooseUs";
import { authUser } from "@/utils/auth";
import ArticleModel from "@/models/Article";
import MobileNav from "@/components/modules/mobileNav/MobileNav";
export default async function Home() {
  const user = await authUser();
  const articles = await ArticleModel.find(
    {},
    "_id slug img title createdAt author tags",
  ).sort({ _id: -1 });

  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        isAdmin={user && user.role === "ADMIN" ? true : false}
        userID={user && user._id.toString()}
      />
      <Banner />
      <Latest />
      <Promote />
      <WhyChooseUs />
      <Articles articles={JSON.parse(JSON.stringify(articles))} />
      <Newsletter />
      <Footer />
      <MobileNav
        isLogin={user ? true : false}
        isAdmin={user?.role == "ADMIN" ? true : false}
      />
    </>
  );
}
