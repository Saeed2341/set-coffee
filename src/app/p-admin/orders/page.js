// app/admin/orders/page.js
import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import OrdersList from "@/components/templates/p-admin/orders/OrdersList";

const OrdersPage = async () => {
  await connectToDB();
  const orders = await OrderModel.find({})
    .populate("userID", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main>
      <OrdersList orders={JSON.parse(JSON.stringify(orders))} />
    </main>
  );
};

export default OrdersPage;
