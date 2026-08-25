import styles from "@/components/templates/p-admin/tickets/ticketDetail.module.css";
import TicketList from "@/components/templates/p-admin/tickets/TicketList";
import TicketDetail from "@/components/templates/p-admin/tickets/TicketDetail";
import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";

const page = async ({ params }) => {
  const { id } = await params;

  await connectToDB();
  const allTickets = await TicketModel.find({})
    .populate("user", "name email phone")
    .populate("department", "title")
    .populate("subDepartment", "title")
    .sort({ updatedAt: -1 })
    .lean();
  const ticket = await TicketModel.findOne({ _id: id })
    .populate("user", "name email phone")
    .populate("department", "title")
    .populate("subDepartment", "title")
    .sort({ _id: -1 })
    .lean();
  // const [ticket, allTickets] = await Promise.all([
  //   TicketModel.findById(id)
  //     .populate("user", "name email phone")
  //     .populate("department", "title")
  //     .populate("subDepartment", "title")
  //     .lean(),
  //   TicketModel.find({})
  //     .populate("user", "name email phone")
  //     .populate("department", "title")
  //     .populate("subDepartment", "title")
  //     .sort({ _id: -1 })
  //     .lean(),
  // ]);

  // if (!ticket) {
  //   return <div>تیکت یافت نشد</div>;
  // }

  return (
    <main className={styles.pageContainer}>
      <TicketList tickets={JSON.parse(JSON.stringify(allTickets))} />
      <TicketDetail ticket={JSON.parse(JSON.stringify(ticket))} />
    </main>
  );
};

export default page;
