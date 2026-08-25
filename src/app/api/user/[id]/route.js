import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { validateEmail, validatePhone } from "@/utils/validators";

export async function PUT(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { id, name, email, phone, role } = body;

    if (!name.trim() || !role.trim()) {
      return Response.json(
        { message: "The information is incomplete.!" },
        { status: 400 },
      );
    }
    if (!validateEmail(email) || !validatePhone(phone)) {
      return Response.json(
        {
          message: "The email or phone number format is incorrect!",
        },
        { status: 422 },
      );
    }

    const currentUser = await UserModel.findOne({ _id: id });
    if (!currentUser) {
      return Response.json({ message: "User not found!" }, { status: 404 });
    }

    if (email && currentUser.email != email) {
      const isExistEmail = await UserModel.findOne({
        email,
        _id: { $ne: id },
      });

      if (isExistEmail)
        return Response.json(
          { message: "A user with this email already exists" },
          { status: 409 },
        );
    }

    if (phone && currentUser.phone != phone) {
      const isExistPhone = await UserModel.findOne({
        phone,
        _id: { $ne: id },
      });

      if (isExistPhone)
        return Response.json(
          { message: "A user with this phone number already exists" },
          { status: 409 },
        );
    }

    await UserModel.findOneAndUpdate(
      { _id: id },
      {
        name,
        email,
        phone,
        role,
      },
    );

    return Response.json(
      { message: "User updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
