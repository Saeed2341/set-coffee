import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyPassword,
} from "@/utils/auth";

import { validateEmail, validatePassword } from "@/utils/validators";
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { email, password } = body;

    const isValidEmail = validateEmail(email);
    const isValidPassword = validatePassword(password);

    if (!isValidEmail || !isValidPassword) {
      return Response.json(
        { message: "Email or Password is invalid" },
        { status: 422 },
      );
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 409 });
    }

    const isCorrectPassword = await verifyPassword(password, user.password);
    if (!isCorrectPassword) {
      return Response.json(
        { message: "Email or Password is invalid" },
        { status: 422 },
      );
    }

    const accessToken = await generateAccessToken({ email });
    const refreshToken = await generateRefreshToken({ email });

    await UserModel.findOneAndUpdate(
      { email },
      {
        $set: { refreshToken },
      },
    );

    const headers = new Headers();
    headers.append("Set-Cookie", `token=${accessToken};path=/;httpOnly=true`);
    headers.append(
      "Set-Cookie",
      `refresh-token=${refreshToken};path=/;httpOnly=true`,
    );

    return Response.json(
      { message: "User logged in successfully" },
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.log("Err ->", error);
    return Response.json(
      { message: "Internal Server Erorr!" + error },
      { status: 500 },
    );
  }
}
