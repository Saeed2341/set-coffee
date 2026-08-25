import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import { authAdmin, authUser } from "@/utils/auth";
import mongoose, { isValidObjectId } from "mongoose";

export async function POST(req) {
  try {
    const admin = await authAdmin();
    if (!admin) throw new Error("This api protected and you can't access it !");
    await connectToDB();
    const reqBody = await req.json();

    const { ticketID, body } = reqBody;
    // const user = await authUser();
    // if (!mainTicketID || !isValidObjectId(mainTicketID)) {
    //   return Response.json(
    //     { message: "Main ticket id not found or is not valid!" },
    //     { status: 409 },
    //   );
    // }
    // if (!title || !body || !department || !subDepartment || !priority) {
    //   return Response.json({ message: "Validation error!" }, { status: 422 });
    // }
    // await TicketModel.create({
    //   title,
    //   body,
    //   department,
    //   subDepartment,
    //   priority,
    //   user: user._id,
    //   isAnswer: true,
    //   hasAnswer: false,
    //   mainTicket: mainTicketID,
    // });

    // await TicketModel.findOneAndUpdate(
    //   { _id: mainTicketID },
    //   {
    //     $set: { hasAnswer: true },
    //   },
    // );

    if (!mongoose.Types.ObjectId.isValid(ticketID)) {
      return Response.json(
        { message: "Ticket ID is not valid!" },
        { status: 422 },
      );
    }
    console.log(ticketID, body);

    const newMessage = {
      body,
      sender: admin.name,
      isAnswer: true,
    };
    const ticket = await TicketModel.findOneAndUpdate(
      { _id: ticketID },
      {
        $push: { messages: newMessage },
        $set: { hasAnswer: true },
      },
    );

    return Response.json(
      { message: "Ticket answer send successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error." + error.message },
      { status: 500 },
    );
  }
}
