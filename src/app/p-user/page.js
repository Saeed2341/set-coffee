import styles from "@/styles/p-user/index.module.css";
import Box from "@/components/templates/p-user/index/Box";
import Tickets from "@/components/templates/p-user/index/Tickets";
import Orders from "@/components/templates/p-user/index/Orders";
import TicketModel from "@/models/Ticket";
import CommentModel from "@/models/Comment";
import WishlistModel from "@/models/Wishlist";
import OrderModel from "@/models/Order";
import { authUser } from "@/utils/auth";

const page = async () => {
  const user = await authUser();
  const commentsCount = await CommentModel.find({
    userID: user._id,
  }).countDocuments();
  const tickets = await TicketModel.find({ user: user._id })
    .populate("department", "title")
    .sort({ _id: -1 })
    .limit(3);
  const ticketCount = await TicketModel.countDocuments({ user: user._id });

  const orders = await OrderModel.find({ userID: user._id })
    .sort({ _id: -1 })
    .limit(4);

  const orderCount = await OrderModel.countDocuments({ userID: user._id });

  const wishlistsCount = await WishlistModel.find({
    userID: user._id,
  }).countDocuments();

  return (
    <main>
      <section className={styles.boxes}>
        <Box title="مجموع تیکت ها " value={ticketCount} />
        <Box title="مجموع کامنت ها " value={commentsCount} />
        <Box title="مجموع سفارشات" value={orderCount} />
        <Box title="مجموع علاقه مندی ها" value={wishlistsCount} />
      </section>
      <section className={styles.contents}>
        <Tickets tickets={JSON.parse(JSON.stringify(tickets))} />
        <Orders orders={JSON.parse(JSON.stringify(orders))} />
      </section>

    </main>
  );
};

export default page;
