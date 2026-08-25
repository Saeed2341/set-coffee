import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import { authUser } from "@/utils/auth";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const user = await authUser();
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const order = await OrderModel.findOne({
      _id: orderId,
      userID: user._id,
    }).lean();

    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    return Response.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
