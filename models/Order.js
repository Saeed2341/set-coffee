const mongoose = require("mongoose");
require("@/models/Product");
const OrderItemSchema = new mongoose.Schema(
  {
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: { type: String, required: true, unique: true },
    authority: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    payableAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "expired",
      ],
      default: "pending",
    },
    shippingAddress: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      company: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    notes: { type: String },
    refId: { type: String },
    paidAt: { type: Date },
    errorCode: { type: String },
    errorMessage: { type: String },
  },
  { timestamps: true },
);

const model = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default model;
