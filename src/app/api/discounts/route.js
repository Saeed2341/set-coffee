import connectToDB from "@/configs/db";
import DiscountModel from "@/models/Discount";
import { authAdmin } from "@/utils/auth";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin)
      throw new Error("This api protected and you can't access it !");
    await connectToDB();
    const body = await req.json();
    const { code, percent, maxUse } = body;

    if (!percent || !maxUse || !code) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }
    if (percent > 100 || percent < 0) {
      return Response.json(
        { message: "Percent must be between 0 and 100" },
        { status: 400 },
      );
    }

    await DiscountModel.create({ code, percent, maxUse });

    return Response.json(
      { message: "Discount created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Internal server error. " + error.message },
      { status: 500 },
    );
  }
}
