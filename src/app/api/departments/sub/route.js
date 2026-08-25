import connectToDB from "@/configs/db";
import SubDepartmentModel from "@/models/SubDepartment";
import { authAdmin } from "@/utils/auth";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin)
      throw new Error("This api protected and you can't access it !");
    await connectToDB();
    const body = await req.json();
    const { title, department } = body;

    if (!title.trim()) {
      return Response.json({ message: "Title is required!" }, { status: 422 });
    }
    if (!mongoose.Types.ObjectId.isValid(department)) {
      return Response.json(
        { message: "Department ID is not valid!" },
        { status: 422 },
      );
    }

    await SubDepartmentModel.create({ title, department });
    return Response.json(
      { message: "Sub dpartment created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error." + error.message },
      { status: 500 },
    );
  }
}
