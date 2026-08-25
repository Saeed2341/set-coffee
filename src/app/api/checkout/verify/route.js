// app/api/payment/verify/route.js
import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import ProductModel from "@/models/Product";
import PaymentModel from "@/models/Payment"; // ✅ اضافه شد
import { verifyPayment } from "@/utils/zarinpal";

export async function GET(req) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  // ============================================
  // ۱. کاربر پرداخت را لغو کرد یا ناموفق بود
  // ============================================
  if (status !== "OK") {
    const order = await OrderModel.findOne({ authority });

    if (order) {
      // ✅ پیدا کردن رکورد Payment مربوطه
      const paymentRecord = await PaymentModel.findOne({
        order: order._id,
        status: "pending",
      });

      // ✅ به‌روزرسانی وضعیت Payment به failed
      if (paymentRecord) {
        await PaymentModel.findByIdAndUpdate(paymentRecord._id, {
          status: "failed",
          gatewayResponse: { reason: "User canceled the payment" },
        });
      }

      // برگرداندن موجودی
      await restoreStock(order);

      // به‌روزرسانی وضعیت سفارش
      order.status = "cancelled";
      order.errorMessage = "پرداخت توسط کاربر لغو شد.";
      await order.save();
    }

    const redirectUrl = new URL("/complate-order", req.url);
    redirectUrl.searchParams.set("status", "failed");
    redirectUrl.searchParams.set("reason", "user_canceled");
    redirectUrl.searchParams.set("message", "پرداخت توسط کاربر لغو شد.");
    return Response.redirect(redirectUrl);
  }

  // ============================================
  // ۲. پیدا کردن سفارش بر اساس authority
  // ============================================
  const order = await OrderModel.findOne({ authority });
  if (!order) {
    const redirectUrl = new URL("/complate-order", req.url);
    redirectUrl.searchParams.set("status", "failed");
    redirectUrl.searchParams.set("reason", "order_not_found");
    redirectUrl.searchParams.set("message", "سفارش مورد نظر یافت نشد.");
    return Response.redirect(redirectUrl);
  }

  // ============================================
  // ۳. جلوگیری از پرداخت مجدد
  // ============================================
  if (order.status === "paid") {
    const redirectUrl = new URL("/complate-order", req.url);
    redirectUrl.searchParams.set("status", "success");
    redirectUrl.searchParams.set("orderId", order._id.toString());
    return Response.redirect(redirectUrl);
  }

  // ============================================
  // ۴. پیدا کردن رکورد Payment با وضعیت pending
  // ============================================
  const paymentRecord = await PaymentModel.findOne({
    order: order._id,
    status: "pending",
  });

  if (!paymentRecord) {
    // اگر رکورد پرداخت وجود نداشت (خطای نادر)
    const redirectUrl = new URL("/complate-order", req.url);
    redirectUrl.searchParams.set("status", "failed");
    redirectUrl.searchParams.set("reason", "payment_record_not_found");
    redirectUrl.searchParams.set(
      "message",
      "رکورد پرداخت برای این سفارش یافت نشد.",
    );
    return Response.redirect(redirectUrl);
  }

  // ============================================
  // ۵. تایید نهایی با زرین‌پال
  // ============================================
  try {
    const verificationResult = await verifyPayment({
      amount: order.payableAmount,
      authority,
    });

    if (verificationResult.success) {
      // ===== پرداخت موفق =====
      // به‌روزرسانی Payment
      await PaymentModel.findByIdAndUpdate(paymentRecord._id, {
        status: "success",
        transactionID: verificationResult.refId,
        paymentDate: new Date(),
        gatewayResponse: verificationResult,
      });

      // به‌روزرسانی Order
      order.status = "paid";
      order.paidAt = new Date();
      order.refId = verificationResult.refId;
      await order.save();

      const redirectUrl = new URL("/complate-order", req.url);
      redirectUrl.searchParams.set("status", "success");
      redirectUrl.searchParams.set("orderId", order._id.toString());
      return Response.redirect(redirectUrl);
    } else {
      // ===== پرداخت ناموفق (تایید نشد) =====
      const errorCode = verificationResult.code || "unknown";
      const errorMessage = getVerificationErrorMessage(errorCode);

      // به‌روزرسانی Payment
      await PaymentModel.findByIdAndUpdate(paymentRecord._id, {
        status: "failed",
        gatewayResponse: verificationResult,
      });

      // به‌روزرسانی Order
      order.status = "failed";
      order.errorCode = errorCode;
      order.errorMessage = errorMessage;
      await order.save();

      // برگرداندن موجودی
      await restoreStock(order);

      const redirectUrl = new URL("/complate-order", req.url);
      redirectUrl.searchParams.set("status", "failed");
      redirectUrl.searchParams.set("reason", "verification_failed");
      redirectUrl.searchParams.set("errorCode", errorCode);
      redirectUrl.searchParams.set("message", errorMessage);
      return Response.redirect(redirectUrl);
    }
  } catch (error) {
    // ===== خطای شبکه یا سرور =====
    console.error("Verify error:", error);

    // به‌روزرسانی Payment به failed
    await PaymentModel.findByIdAndUpdate(paymentRecord._id, {
      status: "failed",
      gatewayResponse: { error: error.message },
    });

    // به‌روزرسانی Order
    order.status = "failed";
    order.errorMessage = error.message || "خطای ارتباط با درگاه پرداخت";
    await order.save();

    // برگرداندن موجودی
    await restoreStock(order);

    const redirectUrl = new URL("/complate-order", req.url);
    redirectUrl.searchParams.set("status", "failed");
    redirectUrl.searchParams.set("reason", "network_error");
    redirectUrl.searchParams.set(
      "message",
      "مشکل در ارتباط با درگاه پرداخت. لطفاً مجدداً تلاش کنید.",
    );
    return Response.redirect(redirectUrl);
  }
}

// ============================================
// توابع کمکی
// ============================================

async function restoreStock(order) {
  try {
    for (const item of order.items) {
      await ProductModel.updateOne(
        { _id: item.productID },
        { $inc: { stock: item.quantity } },
      );
    }
    console.log(`✅ Stock restored for order ${order._id}`);
  } catch (error) {
    console.error(`❌ Failed to restore stock for order ${order._id}:`, error);
  }
}

function getVerificationErrorMessage(code) {
  const messages = {
    "-51": "مبلغ پرداخت شده با مبلغ سفارش همخوانی ندارد",
    "-52": "خطای داخلی در سیستم بانکی",
    "-53": "پرداخت قبلاً تایید شده است",
    "-54": "درخواست تایید نامعتبر است",
    101: "این تراکنش قبلاً تایید شده است",
    unknown: "خطای ناشناخته در تایید پرداخت",
  };
  return messages[code] || messages["unknown"];
}
