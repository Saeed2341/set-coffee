const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const model =
  mongoose.models.Newsletter || mongoose.model("Newsletter", schema);

export default model;
