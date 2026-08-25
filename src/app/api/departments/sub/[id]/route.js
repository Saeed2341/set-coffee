import mongoose from "mongoose";
import SubDepartmentModel from "@/models/SubDepartment";
import connectToDB from "@/configs/db";
export async function GET(req, { params }) {
  await connectToDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return Response.json(
      { message: "Department ID is not valid!" },
      { status: 422 },
    );
  const subDepartment = await SubDepartmentModel.find({ department: id });
  return Response.json(subDepartment);
}
