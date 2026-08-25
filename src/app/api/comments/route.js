import connectToDB from "../../../../configs/db";
import CommentModel from "@/models/Comment";
import ProductModel from "@/models/Product";
import { authAdmin, authUser } from "@/utils/auth";
import { validateEmail } from "@/utils/validators";
import ArticleModel from "@/models/Article";
export async function POST(req) {
  try {
    await connectToDB();
    const user = await authUser();
    if (!user)
      return Response.json({ message: "Please login first!" }, { status: 401 });
    const reqBody = await req.json();
    const { username, email, body, score, targetId, targetType } = reqBody;

    if (
      !username.trim() ||
      !email.trim() ||
      !body.trim() ||
      !targetId ||
      !targetType
    ) {
      return Response.json(
        { message: "Please fill in all fields" },
        { status: "422" },
      );
    }
    if (!validateEmail(email)) {
      return Response.json(
        { message: "Please enter the requested field in the correct format!" },
        { status: "422" },
      );
    }
    if (targetType != "Product" && targetType != "Article") {
      return Response.json(
        { message: "targetType can only be 'Product' or 'Article'" },
        { status: 400 },
      );
    }

    const comment = await CommentModel.create({
      username,
      email,
      body,
      score,
      targetId,
      targetType,
      userID: user._id,
    });
    if (targetType == "Product") {
      await ProductModel.findOneAndUpdate(
        { _id: targetId },
        { $push: { comments: comment._id } },
      );
    } else if (targetType == "Article") {
      await ArticleModel.findOneAndUpdate(
        { _id: targetId },
        { $push: { comments: comment._id } },
      );
    }

    return Response.json(
      { message: "Comment created successfully", comment },
      { status: 201 },
    );
  } catch (error) {
    console.log(error.message);
    return Response.json(
      { message: "Internal server error", error },
      { status: 500 },
    );
  }
}
export async function GET() {
  const isAdmin = await authAdmin();
  if (!isAdmin) throw new Error("This api protected and you can't access it !");
  const comments = await CommentModel.find({}, "-__v");
  return Response.json({ comments });
}
