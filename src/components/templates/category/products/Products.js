"use client";
import styles from "./products.module.css";
import { MdOutlineClose, MdOutlineGridView } from "react-icons/md";
import { BiSolidGrid } from "react-icons/bi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import Pagination from "@/components/modules/pagination/Pagination";
import Product from "@/components/modules/product/Product";
import { useRouter } from "next/navigation";
import { FiPackage } from "react-icons/fi";

const Products = ({
  products,
  currentPage = 1,
  totalPages = 1,
  totalProducts = 0,
  limit = 3,
}) => {
  const router = useRouter();
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/category?page=${newPage}&limit=${limit}`);
    }
  };

  // ===== اگر محصولی وجود نداشت =====
  if (products.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiPackage size={64} />
          </div>
          <h2 className={styles.emptyTitle}>محصولی وجود ندارد</h2>
          <p className={styles.emptyDescription}>
            در حال حاضر هیچ محصولی در این دسته‌بندی موجود نیست. لطفاً بعداً
            مجدداً مراجعه کنید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.products}>
      <div className={styles.filtering}>
        <div className={styles.view}>
          <TfiLayoutGrid4Alt />
          <BiSolidGrid className={styles.active} />
          <MdOutlineGridView />
        </div>
        <select name="orderby">
          <option value="default">مرتب‌سازی پیش‌فرض</option>
          <option value="popularity">مرتب‌سازی بر اساس محبوبیت</option>
          <option value="rating">مرتب‌سازی بر اساس امتیاز</option>
          <option value="last_products">مرتب‌سازی بر اساس آخرین</option>
          <option value="Inexpensive">مرتب‌سازی بر اساس ارزانترین</option>
          <option value="expensive">مرتب‌سازی بر اساس گرانترین</option>
        </select>
      </div>
      <div className={styles.available_filters}>
        <div>
          <p>clear filters</p>
          <MdOutlineClose />
        </div>
        <div>
          <p>اسپرسو ساز خانگی (ریز)</p>
          <MdOutlineClose />
        </div>
        <div>
          <p>اسپرسو ساز خانگی (ریز)</p>
          <MdOutlineClose />
        </div>
        <div>
          <p>اسپرسو ساز خانگی (ریز)</p>
          <MdOutlineClose />
        </div>
        <div>
          <p>اسپرسو ساز خانگی (ریز)</p>
          <MdOutlineClose />
        </div>
        <div>
          <p>اسپرسو ساز خانگی (ریز)</p>
          <MdOutlineClose />
        </div>
        <div>
          <p>اسپرسو ساز خانگی (ریز)</p>
          <MdOutlineClose />
        </div>
      </div>
      <main className={styles.main}>
        {products.map((product) => (
          <Product key={product._id} {...product} />
        ))}
      </main>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Products;