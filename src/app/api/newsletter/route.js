import connectToDB from "@/configs/db";
import NewsletterModel from "@/models/Newsletter";
import { validateEmail } from "@/utils/validators";
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { email } = body;

    if (!validateEmail(email)) {
      return Response.json({ message: "Email is not valid!" }, { status: 422 });
    }

    await NewsletterModel.create({ email });

    return Response.json(
      { message: "Newsletter subscription successful." },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
