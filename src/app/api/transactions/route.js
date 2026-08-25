import connectToDB from "@/configs/db";
import PaymentModel from "@/models/Payment";
import { authAdmin } from "@/utils/auth";

export async function GET(req) {
  try {
    await connectToDB();

    const isAdmin = await authAdmin();

    if (!isAdmin) {
      return Response.json(
        { message: "Forbidden: Admin access only" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const payments = await PaymentModel.find(query)
      .populate({
        path: "order",
        populate: {
          path: "userID",
          select: "name email phone",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    const formattedPayments = payments.map((payment) => ({
      _id: payment._id,
      order: {
        _id: payment.order?._id,
        code: payment.order?.code,
        totalAmount: payment.order?.totalAmount,
        status: payment.order?.status,
        user: payment.order?.userID
          ? {
              name: payment.order.userID.name,
              email: payment.order.userID.email,
              phone: payment.order.userID.phone,
            }
          : null,
      },
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      provider: payment.provider,
      transactionID: payment.transactionID,
      status: payment.status,
      paymentDate: payment.paymentDate,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      gatewayResponse: payment.gatewayResponse,
    }));

    return Response.json({ payments: formattedPayments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return Response.json(
      { message: "Server error: " + error.message },
      { status: 500 },
    );
  }
}
