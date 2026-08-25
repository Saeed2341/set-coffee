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
    const { title, department, subDepartment, priority } = reqBody;

    if (!title.trim() || !priority) {
      return Response.json({ message: "Validation error!" }, { status: 422 });
    }
    if (
      !mongoose.Types.ObjectId.isValid(department) ||
      !mongoose.Types.ObjectId.isValid(subDepartment)
    ) {
      return Response.json(
        { message: "Department ID or sub department ID is not valid!" },
        { status: 422 },
      );
    }

    const newTicket = {
      title,
      department,
      subDepartment,
      priority,
      user: user._id,
    };

    await TicketModel.create(newTicket);

    return Response.json(
      { message: "Ticket saved successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error!" + error.message },
      { status: 500 },
    );
  }
}
