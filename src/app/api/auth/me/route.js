import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
export async function GET() {
  await connectToDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return Response.json({ message: "Token not found!" }, { status: 400 });
  }

  const tokenPayload = verifyAccessToken(token.value);
  if (!tokenPayload) {
    return Response.json({ message: "Token is not valid!" }, { status: 401 });
  }

  const user = await UserModel.findOne(
    { email: tokenPayload.email },
    "-password -refreshToken -__v",
  );

  return Response.json(user);
}
