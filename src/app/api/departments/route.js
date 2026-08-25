import connectToDB from "@/configs/db";
import DepartmentModel from "@/models/Department";
import { authAdmin } from "@/utils/auth";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin)
      throw new Error("This api protected and you can't access it !");
    await connectToDB();
    const body = await req.json();
    const { title } = body;

    if (!title.trim()) {
      return Response.json({ message: "Title is required!" }, { status: 422 });
    }

    await DepartmentModel.create({ title });
    return Response.json(
      { message: "Department created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error." + error.message },
      { status: 500 },
    );
  }
}
export async function GET() {
  await connectToDB();
  const departments = await DepartmentModel.find({});
  return Response.json(departments);
}
