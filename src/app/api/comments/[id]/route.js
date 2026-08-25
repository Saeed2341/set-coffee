import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import { authAdmin } from "@/utils/auth";
import { isValidObjectId } from "mongoose";

export async function PUT(req, { params }) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin)
      throw new Error("This api protected and you can't access it !");

    await connectToDB();
    const reqBody = await req.json();
    const { body } = reqBody;
    const { id } = await params;

    if (!id || !isValidObjectId(id)) {
      return Response.json(
        { message: "ID not found or not valid!" },
        { status: 422 },
      );
    }

    await CommentModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { body },
      },
    );
    return Response.json({ message: "Comment updated successfully" });
  } catch (error) {
    return Response.json(
      {
        message: "Internal server error: " + error.message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin)
      throw new Error("This api protected and you can't access it !");

    await connectToDB();

    const { id } = await params;

    if (!id || !isValidObjectId(id)) {
      return Response.json(
        { message: "ID not found or not valid!" },
        { status: 422 },
      );
    }

    await CommentModel.findOneAndDelete({ _id: id });
    return Response.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return Response.json(
      {
        message: "Internal server error: " + error.message,
      },
      { status: 500 },
    );
  }
}
