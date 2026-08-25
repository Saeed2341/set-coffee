import connectToDB from "../../../../../configs/db";
import UserModel from "@/models/User";
import { generateAccessToken, hashPassword } from "@/utils/auth";
import { roles } from "@/utils/constants";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/utils/validators";
export async function POST(req) {
  await connectToDB();

  const body = await req.json();
  const { name, email, phone, password } = body;

  // Body Validatino
  const isValidPhone = validatePhone(phone);
  const isValidPssword = validatePassword(password);
  const isValidEmail = email ? validateEmail(email) : true;
  if (!name.trim() || !isValidPhone || !isValidPssword || !isValidEmail) {
    return Response.json(
      {
        message: "Validation Erorr!",
      },
      {
        status: 422,
      },
    );
  }

  const isUserExist = await UserModel.findOne({
    $or: [{ phone }, { email }],
  });

  if (isUserExist) {
    return Response.json(
      {
        message: "The username or phone or email already exists !",
      },
      {
        status: 409,
      },
    );
  }

  const hashedPassword = await hashPassword(password);

  const accessToken = generateAccessToken({ name });

  const users = await UserModel.find({});

  await UserModel.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: users.length > 0 ? roles.USER : roles.ADMIN,
  });

  return Response.json(
    { message: "User registered successfully" },
    {
      status: 201,
      headers: { "Set-Cookie": `token=${accessToken};path=/;httpOnly=true` },
    },
  );
}
