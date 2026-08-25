const mongoose = require("mongoose");
require("./Product");
require("./User");

const schema = new mongoose.Schema(
  {
    productID: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const model = mongoose.models.Wishlist || mongoose.model("Wishlist", schema);

export default model;
