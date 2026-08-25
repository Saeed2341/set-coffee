import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import UserModel from "@/models/User";
import connectToDB from "@/configs/db";

const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

const verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

const generateAccessToken = (data) => {
  const token = sign({ ...data }, process.env.AccessTokenSecretKey, {
    expiresIn: "15day",
  });
  return token;
};

const verifyAccessToken = (token) => {
  try {
    const tokenPayload = verify(token, process.env.AccessTokenSecretKey);
    return tokenPayload;
  } catch (err) {
    console.log("Verify Access Token Error ->", err);
    return false;
  }
};

const generateRefreshToken = (data) => {
  const token = sign({ ...data }, process.env.RefreshTokenSecretKey, {
    expiresIn: "30day",
  });
  return token;
};

const authUser = async () => {
  await connectToDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  let user = null;

  if (token) {
    const tokenPayload = verifyAccessToken(token.value);
    if (tokenPayload) {
      user = await UserModel.findOne({ email: tokenPayload.email }).lean();
    }
  }

  return user;
};
const authAdmin = async () => {
  await connectToDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  let user = null;

  if (token) {
    const tokenPayload = verifyAccessToken(token.value);
    if (tokenPayload) {
      user = await UserModel.findOne({ email: tokenPayload.email }).lean();
      if (user.role === "ADMIN") {
        return user;
      } else return null;
    } else return null;
  } else {
    return null;
  }
};

export {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  authUser,
  authAdmin,
  isAdminMiddleware,
};
