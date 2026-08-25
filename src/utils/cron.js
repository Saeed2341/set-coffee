import cron from "node-cron";
import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import ProductModel from "@/models/Product";
import PaymentModel from "@/models/Payment";

async function cleanupPendingOrders() {
  try {
    await connectToDB();
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const expiredOrders = await OrderModel.find({
      status: "pending",
      createdAt: { $lt: thirtyMinutesAgo },
    });

    for (const order of expiredOrders) {
      const updatedOrder = await OrderModel.findOneAndUpdate(
        {
          _id: order._id,
          status: "pending",
        },
        {
          $set: {
            status: "expired",
            errorMessage: "سفارش به دلیل عدم تکمیل پرداخت منقضی شد.",
          },
        },
        { returnDocument: "after" },
      );

      if (!updatedOrder) {
        continue;
      }

      for (const item of updatedOrder.items) {
        await ProductModel.updateOne(
          { _id: item.productID },
          { $inc: { stock: item.quantity } },
        );
      }

      await PaymentModel.updateOne(
        { order: updatedOrder._id, status: "pending" },
        {
          $set: {
            status: "failed",
            gatewayResponse: { reason: "Order expired" },
          },
        },
      );
    }
  } catch (error) {
    console.error("Cleanup job failed:", error);
  }
}

cron.schedule("*/15 * * * *", () => {
  cleanupPendingOrders();
});
