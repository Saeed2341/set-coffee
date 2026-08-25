import connectToDB from "@/configs/db";
import BanModel from "@/models/Ban";
import { authAdmin } from "@/utils/auth";
import { validateEmail, validatePhone } from "@/utils/validators";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin)
      throw new Error("This api protected and you can't access it !");
    await connectToDB();
    const body = await req.json();
    const { phone, email } = body;

    if (phone && !validatePhone(phone)) {
      return Response.json(
        { message: "phone format is not valid!" },
        { status: 422 },
      );
    }
    if (email && !validateEmail(email)) {
      return Response.json(
        { message: "email format is not valid!" },
        { status: 422 },
      );
    }

    const isBan = await BanModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (isBan) {
      await BanModel.findByIdAndDelete(isBan._id);
      return Response.json(
        { message: "User unbanned successfully" },
        { status: 200 },
      );
    }

    await BanModel.create({ phone, email });
    return Response.json(
      { message: "User banned successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error. " + error.message },
      { status: 500 },
    );
  }
}
