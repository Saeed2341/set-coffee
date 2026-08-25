const mongoose = require("mongoose");
require("./Department");
require("./SubDepartment");
require("./User");

const ticketItemSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  isAnswer: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    messages: {
      type: [ticketItemSchema],
      // required: true,
    },
    department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    subDepartment: {
      type: mongoose.Types.ObjectId,
      ref: "SubDepartment",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: Number,
      default: 1,
      enum: [1, 2, 3],
    },
    hasAnswer: {
      type: Boolean,
      default: false,
    },
    // isAnswer: {
    //   type: Boolean,
    //   default: false,
    // },
    // mainTicket: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Ticket",
    //   required: false,
    // },
  },
  { timestamps: true },
);

const model = mongoose.models.Ticket || mongoose.model("Ticket", schema);

export default model;
