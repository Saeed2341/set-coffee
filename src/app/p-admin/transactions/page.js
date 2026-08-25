// app/admin/transactions/page.js
import connectToDB from "@/configs/db";
import PaymentModel from "@/models/Payment";
import TransactionsList from "@/components/templates/p-admin/transactions/TransactionsList";

const TransactionsPage = async () => {
  await connectToDB();
  const payments = await PaymentModel.find({})
    .populate({
      path: "order",
      populate: { path: "userID", select: "name email" },
    })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main>
      <TransactionsList payments={JSON.parse(JSON.stringify(payments))} />
    </main>
  );
};

export default TransactionsPage;
