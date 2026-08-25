import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { authAdmin } from "@/utils/auth";
import { isValidObjectId } from "mongoose";

export async function PUT(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin)
      throw new Error("This api protected and you can't access it !");
    await connectToDB();
    const body = await req.json();
    const { id } = body;
    if (!isValidObjectId(id)) {
      return Response.json({ message: "ID is not valid!" }, { status: 422 });
    }
    const user = await UserModel.findOne({ _id: id }).lean();

    if (!user) {
      return Response.json({ message: "User not found!" }, { status: 409 });
    }

    await UserModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          role: user.role == "ADMIN" ? "USER" : "ADMIN",
        },
      },
    );
    return Response.json({ message: "User role changed successfully" });
  } catch (error) {
    return Response.json(
      { message: "Internal server error. " + error.message },
      { status: 500 },
    );
  }
}
