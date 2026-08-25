import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { generateAccessToken } from "@/utils/auth";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh-token")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { message: "No have refresh token!" },
        { status: 401 },
      );
    }

    const user = await UserModel.findOne({ refreshToken });

    if (!user) {
      return NextResponse.json(
        { message: "No have refresh token!" },
        { status: 401 },
      );
    }

    verify(refreshToken, process.env.RefreshTokenSecretKey);
    const newAccessToken = await generateAccessToken({ email: user.email });

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `token=${newAccessToken};path=/;httpOnly=true`,
    );

    return Response.json(
      { message: "New access token generated successfully" },
      { status: 200, headers },
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
