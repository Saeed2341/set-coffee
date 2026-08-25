import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import { authAdmin } from "@/utils/auth";
import ProductModel from "@/models/Product";
export async function POST(req) {
  try {
    await connectToDB();
    const admin = await authAdmin();
    if (!admin) {
      return Response.json(
        { message: "Forbidden: Admin access only" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { answer, mainComment, targetId, targetType } = body;

    const comment = await CommentModel.findOne({ _id: mainComment });

    if (!comment) {
      return Response.json(
        { message: "Main comment not found!" },
        { status: 404 },
      );
    }

    await CommentModel.findOneAndUpdate(
      { _id: comment._id },
      { $set: { hasAnswer: true, status: "accept" } },
    );

    const newComment = await CommentModel.create({
      username: admin.name,
      body: answer,
      email: admin.email,
      status: "accept",
      isAnswer: true,
      hasAnswer: false,
      mainComment,
      targetId,
      targetType,
      userID: admin._id,
    });

    await ProductModel.findOneAndUpdate(
      { _id: targetId },
      { $push: { comments: newComment._id } },
    );

    return Response.json(
      { message: "Comment Answered successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server erorr: " + error.message },
      { status: 500 },
    );
  }
}
