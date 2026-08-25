import styles from "@/styles/p-user/answerTicket.module.css";
import Link from "next/link";
import Answer from "@/components/templates/p-user/tickets/Answer";
import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";

const page = async ({ params }) => {
  const { id } = await params;
  await connectToDB();
  const ticket = await TicketModel.findOne({ _id: id }, "title body createdAt")
    .populate("user", "name")
    .lean();

  const ticketAnswer = await TicketModel.findOne(
    {
      mainTicket: ticket._id,
    },
    "body createdAt",
  )
    .populate("user", "name ")
    .lean();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        {ticket.title}
        <Link href="/p-user/tickets/sendTicket">ارسال تیکت جدید</Link>
      </h1>

      <div>
        <Answer type="user" {...ticket} />
        {ticketAnswer ? (
          <Answer type="admin" {...ticketAnswer} />
        ) : (
          <div className={styles.empty}>
            <p>هنوز پاسخی دریافت نکردید</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default page;
