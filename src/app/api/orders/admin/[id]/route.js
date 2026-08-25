import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import PaymentModel from "@/models/Payment";
import ProductModel from "@/models/Product";
import { authAdmin } from "@/utils/auth";

export async function GET(req, { params }) {
  try {
    await connectToDB();

    const isAdmin = await authAdmin();

    if (!isAdmin) {
      return Response.json(
        { message: "Forbidden: Admin access only" },
        { status: 403 },
      );
    }

    const { id } = await params;

    const order = await OrderModel.findById(id)
      .populate("userID", "name email phone role")
      .lean();

    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    const payments = await PaymentModel.find({ order: id })
      .sort({ createdAt: -1 })
      .lean();

    const productIds = order.items.map((item) => item.productID);
    const products = await ProductModel.find(
      { _id: { $in: productIds } },
      "name price img slug",
    ).lean();

    const productMap = {};
    products.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    const enrichedItems = order.items.map((item) => {
      const product = productMap[item.productID.toString()];
      return {
        ...item,
        productDetails: product || null,
      };
    });

    const responseData = {
      order: {
        ...order,
        items: enrichedItems,
        payments: payments,
      },
    };

    return Response.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return Response.json(
      { message: "Server error: " + error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "expired",
    ];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { message: "Invalid status value" },
        { status: 400 },
      );
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    )
      .populate("userID", "name email")
      .lean();

    if (!updatedOrder) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    return Response.json({ order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return Response.json(
      { message: "Server error: " + error.message },
      { status: 500 },
    );
  }
}
