import styles from "@/styles/p-user/wishlist.module.css";
import Product from "@/components/templates/p-user/wishlist/Product";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth";
import WishlistModel from "@/models/Wishlist";
import { FaHeart } from "react-icons/fa";

const page = async () => {
  await connectToDB();
  const user = await authUser();
  const wishlist = await WishlistModel.find({ userID: user._id })
    .populate("productID")
    .lean();

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>علاقه‌مندی‌ها</h1>
        <span className={styles.count}>
          {wishlist.length} {wishlist.length === 1 ? "محصول" : "محصول"}
        </span>
      </div>

      {wishlist.length ? (
        <div className={styles.grid}>
          {wishlist.map((wish) => (
            <Product
              key={wish._id}
              productID={wish.productID._id.toString()}
              name={wish.productID.name}
              price={wish.productID.price}
              score={wish.productID.score}
              img={wish.productID.img}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <FaHeart size={48} />
          </div>
          <h2 className={styles.emptyTitle}>لیست علاقه‌مندی‌ها خالی است</h2>
          <p className={styles.emptyDescription}>
            هنوز هیچ محصولی به لیست علاقه‌مندی‌های خود اضافه نکرده‌اید.
          </p>
          <a href="/category" className={styles.emptyLink}>
            مشاهده محصولات
          </a>
        </div>
      )}
    </main>
  );
};

export default page;