import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import MobileNav from "@/components/modules/mobileNav/MobileNav";
import Navbar from "@/components/modules/navbar/Navbar";
import Filtering from "@/components/templates/category/filtering/Filtering";
import Products from "@/components/templates/category/products/Products";
import ProductModel from "@/models/Product";
import styles from "@/styles/category.module.css";
import { authUser } from "@/utils/auth";

const page = async ({ searchParams }) => {
  const user = await authUser();
  const { page, limit } = await searchParams;

  const skip = (page - 1) * limit;

  const totalProducts = await ProductModel.countDocuments();

  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        isAdmin={user && user.role === "ADMIN" ? true : false}
        userID={user && user._id.toString()}
      />
      <Breadcrumb route={"فروشگاه"} />
      <main
        className={styles.container}
        data-aos="fade-up"
        suppressHydrationWarning
      >
        <div className={styles.category}>
          <Products
            currentPage={page}
            totalPages={totalPages}
            totalProducts={totalProducts}
            limit={limit}
            products={JSON.parse(JSON.stringify(products))}
          />
          <Filtering />
        </div>
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
