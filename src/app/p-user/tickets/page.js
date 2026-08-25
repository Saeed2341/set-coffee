import styles from "@/components/templates/p-user/tickets/ticketDetail.module.css";
import TicketList from "@/components/templates/p-user/tickets/TicketList";
import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import { authUser } from "@/utils/auth";
import { FaRegCommentDots } from "react-icons/fa";

const page = async () => {
  await connectToDB();
  const user = await authUser();

  const tickets = await TicketModel.find({ user: user._id })
    .populate("department", "title")
    .populate("subDepartment", "title")
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <main className={styles.pageContainer}>
      <TicketList tickets={JSON.parse(JSON.stringify(tickets))} />

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <FaRegCommentDots size={64} color="#d7ccc8" />
        </div>
        <h3>یک تیکت را انتخاب کنید</h3>
        <p>
          برای مشاهده جزئیات و پیام‌ها، روی یکی از تیکت‌های سمت راست کلیک کنید.
        </p>
      </div>
    </main>
  );
};

export default page;
