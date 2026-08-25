import styles from "@/components/templates/p-user/tickets/ticketDetail.module.css";
import TicketList from "@/components/templates/p-user/tickets/TicketList";
import TicketDetail from "@/components/templates/p-user/tickets/TicketDetail";
import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import { authUser } from "@/utils/auth";

const page = async ({ params }) => {
  const { id } = await params;

  await connectToDB();
  const user = await authUser();

  const [ticket, allTickets] = await Promise.all([
    TicketModel.findById(id)
      .populate("department", "title")
      .populate("subDepartment", "title")
      .lean(),
    TicketModel.find({ user: user._id })
      .populate("department", "title")
      .populate("subDepartment", "title")
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  if (!ticket) {
    return <div className={styles.emptyState}>تیکت یافت نشد</div>;
  }

  return (
    <main className={styles.pageContainer}>
      <TicketList tickets={JSON.parse(JSON.stringify(allTickets))} />
      <TicketDetail
        ticket={JSON.parse(JSON.stringify(ticket))}
        user={JSON.parse(JSON.stringify(user))}
      />
    </main>
  );
};

export default page;
