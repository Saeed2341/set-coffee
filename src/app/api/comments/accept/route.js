import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import { authAdmin } from "@/utils/auth";
export async function PUT(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin)
      throw new Error("This api protected and you can't access it !");
    await connectToDB();
    const body = await req.json();
    const { commentID } = body;
    await CommentModel.findOneAndUpdate(
      { _id: commentID },
      {
        $set: {
          status: "accept",
        },
      },
    );
    return Response.json({ message: "Comment accepted successfully" });
  } catch (error) {
    return Response.json(
      { message: "Internal server error. " + error.message },
      { status: 500 },
    );
  }
}
