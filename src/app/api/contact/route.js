import connectToDB from "@/configs/db";
import ContactModel from "@/models/Contact";
import { validateEmail, validatePhone } from "@/utils/validators";

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { email, name, phone, company, message } = body;

    if (!name || !message || !validateEmail(email) || !validatePhone(phone)) {
      return Response.json({ message: "Validation error!" }, { status: 422 });
    }

    await ContactModel.create({
      email,
      name,
      phone,
      company,
      message,
    });

    return Response.json(
      { message: "Message send successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error", error },
      { status: 500 },
    );
  }
}
