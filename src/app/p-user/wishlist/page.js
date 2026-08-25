import styles from "@/styles/p-user/wishlist.module.css";
import Product from "@/components/templates/p-user/wishlist/Product";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth";
import WishlistModel from "@/models/Wishlist";

const page = async () => {
  connectToDB();
  const user = await authUser();
  const wishlist = await WishlistModel.find({ userID: user._id })
    .populate("productID")
    .lean();

  return (
    <main>
      <h1 className={styles.title}>علاقه مندی ها</h1>
      <div className={styles.container}>
        {wishlist.length ? (
          wishlist.map((wish) => (
            <Product
              key={wish._id}
              productID={wish.productID._id.toString()}
              name={wish.productID.name}
              price={wish.productID.price}
              score={wish.productID.score}
              img={wish.productID.img}
              // {...wish}
            />
          ))
        ) : (
          <p className={styles.empty}>محصولی وجود ندارد</p>
        )}
      </div>
    </main>
  );
};

export default page;
