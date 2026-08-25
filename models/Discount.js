const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    percent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    maxUse: {
      type: Number,
      required: true,
    },
    uses: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true },
);

const model = mongoose.models.Discount || mongoose.model("Discount", schema);
export default model;
