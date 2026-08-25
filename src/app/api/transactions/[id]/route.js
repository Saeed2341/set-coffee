import connectToDB from "@/configs/db";
import PaymentModel from "@/models/Payment";
import OrderModel from "@/models/Order";
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

    const payment = await PaymentModel.findById(id)
      .populate({
        path: "order",
        populate: {
          path: "userID",
          select: "name email phone role",
        },
      })
      .lean();

    if (!payment) {
      return Response.json(
        { message: "Transaction not found" },
        { status: 404 },
      );
    }

    let enrichedOrder = null;
    if (payment.order) {
      const order = payment.order;

      const productIds = order.items?.map((item) => item.productID) || [];
      const products = await ProductModel.find(
        { _id: { $in: productIds } },
        "name price img slug weight roastLevel",
      ).lean();

      const productMap = {};
      products.forEach((p) => {
        productMap[p._id.toString()] = p;
      });

      const enrichedItems =
        order.items?.map((item) => ({
          ...item,
          productDetails: productMap[item.productID.toString()] || null,
        })) || [];

      enrichedOrder = {
        ...order,
        items: enrichedItems,
      };
    }

    const responseData = {
      payment: {
        _id: payment._id,
        order: enrichedOrder,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        provider: payment.provider,
        transactionID: payment.transactionID,
        status: payment.status,
        paymentDate: payment.paymentDate,
        gatewayResponse: payment.gatewayResponse,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    };

    return Response.json(responseData, { status: 200 });
  } catch (error) {
    console.error("rror fetching transaction details:", error);
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

    const validStatuses = ["pending", "success", "failed", "refunded"];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { message: "Invalid status value" },
        { status: 400 },
      );
    }

    const updatedPayment = await PaymentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    )
      .populate({
        path: "order",
        populate: { path: "userID", select: "name email" },
      })
      .lean();

    if (!updatedPayment) {
      return Response.json(
        { message: "Transaction not found" },
        { status: 404 },
      );
    }

    // بازگشت موجودی
    // if (status === "refunded") {

    // }

    return Response.json({ payment: updatedPayment }, { status: 200 });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return Response.json(
      { message: "Server error: " + error.message },
      { status: 500 },
    );
  }
}
