const mongoose = require("mongoose");
require("./Product");
require("./Article");
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    // required: true,
  },
  status: {
    type: String,
    enum: ["accept", "reject", "pending"],
    default: "pending",
  },

  isAnswer: {
    type: Boolean,
    required: true,
    default: false,
  },
  hasAnswer: {
    type: Boolean,
    required: true,
    default: false,
  },
  mainComment: {
    type: mongoose.Types.ObjectId,
    ref: "Comment",
  },
  date: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
  },

  targetId: {
    type: mongoose.Types.ObjectId,
    required: true,
    refPath: "targetType",
  },
  targetType: {
    type: String,
    required: true,
    enum: ["Product", "Article"],
  },
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const model = mongoose.models.Comment || mongoose.model("Comment", schema);

export default model;
