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
  const { page = 1, limit = 12 } = await searchParams;
  const currentPage = Number(page);
  const itemsPerPage = Number(limit);
  const skip = (currentPage - 1) * itemsPerPage;

  const [products, totalProducts] = await Promise.all([
    ProductModel.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .lean(),
    ProductModel.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const hasProducts = products && products.length > 0;

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
          <div className={styles.productsWrapper}>
            <Products
              currentPage={currentPage}
              totalPages={totalPages}
              totalProducts={totalProducts}
              limit={itemsPerPage}
              products={JSON.parse(JSON.stringify(products))}
            />
          </div>
          {hasProducts && (
            <aside className={styles.filterSidebar}>
              <Filtering />
            </aside>
          )}
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
