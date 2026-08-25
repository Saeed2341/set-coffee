import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import { authUser } from "@/utils/auth";
import mongoose from "mongoose";
export async function POST(req) {
  try {
    await connectToDB();

    const user = await authUser();

    if (!user)
      return Response.json(
        { message: "User not found. please login first!" },
        { status: 404 },
      );
    const reqBody = await req.json();
    const { ticketID, body } = reqBody;

    if (!mongoose.Types.ObjectId.isValid(ticketID)) {
      return Response.json(
        { message: "Ticket ID is not valid!" },
        { status: 422 },
      );
    }

    const newMessage = {
      body,
      sender: user.name,
      isAnswer: false,
    };

    const ticket = await TicketModel.findOneAndUpdate(
      { _id: ticketID },
      {
        $push: { messages: newMessage },
        $set: { hasAnswer: false },
      },
    );

    return Response.json(
      { message: "Message send successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error!" + error.message },
      { status: 500 },
    );
  }
}
