import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import { authUser } from "@/utils/auth";

export async function GET(req) {
  try {
    await connectToDB();
    const user = await authUser();
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || 1);
    const limit = parseInt(url.searchParams.get("limit") || 5);
    const skip = (page - 1) * limit;

    const ordersCount = await OrderModel.countDocuments({ userID: user._id });
    const totalPages = Math.ceil(ordersCount / limit);

    const orders = await OrderModel.find({ userID: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // فرمت داده‌ها برای نمایش
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      code: order.code,
      createdAt: order.createdAt,
      total: order.payableAmount || order.totalAmount,
      status: order.status,
      itemsCount: order.items.length,
      paidAt: order.paidAt,
      shippingAddress: order.shippingAddress,
      items: order.items,
      discountAmount: order.discountAmount || 0,
      totalAmount: order.totalAmount,
    }));

    return Response.json(
      { orders: formattedOrders, totalPages },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
