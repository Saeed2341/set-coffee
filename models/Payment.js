const mongoose = require("mongoose");
require("@/models/Order");

const schema = new mongoose.Schema(
  {
    order: { type: mongoose.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["card", "wallet", "online"],
      required: true,
    },
    provider: {
      type: String,
      enum: ["zarinpal", "melli"],
      required: true,
    },
    transactionID: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      required: true,
      default: "pending",
    },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed },
    paymentDate: { type: Date },
  },
  { timestamps: true },
);

const model = mongoose.models.Payment || mongoose.model("Payment", schema);

export default model;
