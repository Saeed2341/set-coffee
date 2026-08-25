import { createPayment } from "@/utils/zarinpal";
import OrderModel from "@/models/Order";
import { authUser } from "@/utils/auth";
import ProductModel from "@/models/Product";
import PaymentModel from "@/models/Payment";
import DiscountModel from "@/models/Discount";
import connectToDB from "@/configs/db";
import mongoose from "mongoose";

export async function POST(req) {
  await connectToDB();

  const user = await authUser();
  if (!user) {
    return Response.json({ message: "User not found!" }, { status: 401 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();
    const { items, shippingAddress, notes, discountCode } = body;

    // ===== اعتبارسنجی اولیه =====
    if (!items || items.length === 0) {
      throw new Error("سبد خرید خالی است");
    }

    // ===== دریافت اطلاعات محصولات =====
    const productIDs = items.map((item) => item.productID);
    const products = await ProductModel.find(
      { _id: { $in: productIDs } },
      null,
      { session },
    );

    // ===== محاسبه مبالغ و ساخت آیتم‌های سفارش =====
    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productID);
      if (!product) throw new Error(`Product ${item.productID} not found!`);
      if (product.stock < item.quantity) {
        throw new Error(`موجودی محصول ${product.name} کافی نیست`);
      }
      const unitPrice = product.price;
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;
      return {
        productID: item.productID,
        name: product.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    // ===== تخفیف =====
    console.log("DISCOUNT CODE: ", discountCode);
    let discountAmount = 0;
    if (discountCode) {
      const discount = await DiscountModel.findOne(
        { code: discountCode },
        null,
        { session },
      );
      if (!discount) throw new Error("کد تخفیف یافت نشد");
      if (discount.uses >= discount.maxUse) {
        throw new Error("تعداد استفاده از کد تخفیف به پایان رسیده");
      }
      discountAmount = (totalAmount * discount.percent) / 100;
      const updatedDiscount = await DiscountModel.findOneAndUpdate(
        { _id: discount._id, uses: { $lt: discount.maxUse } },
        { $inc: { uses: 1 } },
        { session, returnDocument: "after" },
      );
      if (!updatedDiscount) {
        throw new Error("تعداد استفاده از کد تخفیف به پایان رسیده");
      }
    }
    const shippingCost = 30000;
    const taxRate = 0.009;
    const taxAmount = Math.round((totalAmount - discountAmount) * taxRate);
    const payableAmount =
      totalAmount - discountAmount + shippingCost + taxAmount;

    // ===== کاهش موجودی =====
    for (const item of orderItems) {
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: item.productID, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session, returnDocument: "after" },
      );
      if (!updatedProduct) {
        throw new Error(`موجودی محصول ${item.name} کافی نیست`);
      }
    }

    const code = `ORD-${Date.now()}`;
    let payment;
    try {
      payment = await createPayment({
        amount: payableAmount,
        description: `سفارش ${code}`,
        mobile: shippingAddress?.phone,
      });
    } catch (error) {
      throw new Error("خطا در اتصال به درگاه پرداخت");
    }

    if (!payment?.authority) {
      throw new Error("پاسخ نامعتبر از درگاه پرداخت");
    }

    const orderData = {
      userID: user._id,
      code,
      items: orderItems,
      totalAmount,
      discountAmount,
      shippingCost,
      taxAmount,
      payableAmount,
      shippingAddress,
      notes: notes || "",
      status: "pending",
      authority: payment.authority,
    };

    const order = await OrderModel.create([orderData], { session });

    await PaymentModel.create(
      [
        {
          order: order[0]._id,
          amount: payableAmount,
          paymentMethod: "online",
          provider: "zarinpal",
          transactionID: payment.authority,
          status: "pending",
          gatewayResponse: payment,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return Response.json(
      {
        message: "سفارش با موفقیت ثبت شد",
        paymentUrl: payment.paymentUrl,
        orderCode: code,
        authority: payment.authority,
      },
      { status: 201 },
    );
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("❌ Checkout error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
