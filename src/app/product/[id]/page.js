import styles from "@/styles/product.module.css";
import Gallery from "@/components/templates/product/Gallery";
import Details from "@/components/templates/product/Details";
import Tabs from "@/components/templates/product/Tabs";
import MoreProducts from "@/components/templates/product/MoreProducts";

import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import { authUser } from "@/utils/auth";
import ProductModel from "@/models/Product";
import connectToDB from "../../../../configs/db";
import MobileNav from "@/components/modules/mobileNav/MobileNav";
const product = async ({ params }) => {
  const user = await authUser();
  const { id } = await params;
  await connectToDB();
  const product = await ProductModel.findById(id).populate("comments").lean();

  const relatedProducts = await ProductModel.find({
    smell: product.smell,
  }).lean();
  return (
    <div className={styles.container}>
      <Navbar
        isLogin={user ? true : false}
        isAdmin={user && user.role === "ADMIN" ? true : false}
        userID={user && user._id.toString()}
      />
      <div
        data-aos="fade-up"
        suppressHydrationWarning
        className={styles.contents}
      >
        <div className={styles.main}>
          <Details product={JSON.parse(JSON.stringify(product))} />
          <Gallery />
        </div>
        <Tabs product={JSON.parse(JSON.stringify(product))} />
        <MoreProducts
          relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
        />
      </div>
      <Footer />
           <MobileNav
        isLogin={user ? true : false}
        isAdmin={user?.role == "ADMIN" ? true : false}
      />
    </div>
  );
};

export default product;
