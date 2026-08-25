import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { authAdmin, authUser, hashPassword } from "@/utils/auth";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/utils/validators";
import { isValidObjectId } from "mongoose";

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { name, email, phone, password, role } = body;

    if (!name.trim() || !password.trim() || !role.trim()) {
      return Response.json(
        { message: "The information is incomplete.!" },
        { status: 400 },
      );
    }

    if (
      !validateEmail(email) ||
      !validatePhone(phone) ||
      !validatePassword(password)
    ) {
      return Response.json(
        {
          message: "The email, phone number, or password format is incorrect!",
        },
        { status: 422 },
      );
    }

    const isExsitUser = await UserModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (isExsitUser) {
      return Response.json(
        {
          message: "A user with this information already exists.!",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    await UserModel.create({
      name,
      email,
      phone,
      role: role ? role : "USER",
      password: hashedPassword,
    });

    return Response.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "internal server error: " + error.message },
      { status: 409 },
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { name, phone, email } = body;

    if (!name.trim || !validateEmail(email) || !validatePhone(phone)) {
      return Response.json({ message: "Validation error!" }, { status: 422 });
    }
    const userInfo = await authUser();

    await UserModel.findOneAndUpdate(
      { _id: userInfo._id },
      {
        $set: {
          name,
          phone,
          email,
        },
      },
    );

    return Response.json({ message: "User updated successfully" });
  } catch (error) {
    return Response.json(
      { message: "Internal server error!" },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  const isAdmin = await authAdmin();
  if (!isAdmin) throw new Error("This api protected and you can't access it !");
  try {
    await connectToDB();
    const body = await req.json();
    const { id } = body;

    if (!isValidObjectId(id)) {
      return Response.json({ message: "ID is not valid!" }, { status: 422 });
    }

    const deletedUser = await UserModel.findOneAndDelete({ _id: id });
    if (!deletedUser) {
      return Response.json({ message: "User not found!" }, { status: 409 });
    }
    return Response.json({ message: "User deleted successfully" });
  } catch (error) {
    return Response.json(
      { message: "Internal server error." + error.message },
      { status: 500 },
    );
  }
}
