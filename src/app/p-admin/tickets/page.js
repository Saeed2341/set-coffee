import styles from "@/components/templates/p-admin/tickets/ticketList.module.css";
import TicketList from "@/components/templates/p-admin/tickets/TicketList";
import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import { authAdmin } from "@/utils/auth";
import { FaRegCommentDots } from "react-icons/fa";

const page = async () => {
  await connectToDB();
  const admin = await authAdmin();

  const tickets = await TicketModel.find({})
    .populate("user", "name email phone")
    .populate("department", "title")
    .populate("subDepartment", "title")
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <div className={styles.pageContainer}>
      {/* ===== لیست تیکت‌ها (در موبایل تمام صفحه) ===== */}
      <TicketList tickets={JSON.parse(JSON.stringify(tickets))} />

      {/* ===== حالت خالی برای دسکتاپ ===== */}
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <FaRegCommentDots size={64} color="#d7ccc8" />
        </div>
        <h3>یک تیکت را انتخاب کنید</h3>
        <p>برای مشاهده جزئیات و پاسخگویی، روی یکی از تیکت‌های سمت راست کلیک کنید.</p>
      </div>
    </div>
  );
};

export default page;