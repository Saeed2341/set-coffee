import connectToDB from "@/configs/db";
import AddressModel from "@/models/Address";
import { authUser } from "@/utils/auth";
import { validateEmail, validatePhone } from "@/utils/validators";

export async function POST(req) {
  try {
    await connectToDB();
    const user = await authUser();
    if (!user)
      return Response.json({ message: "User not found!" }, { status: 403 });

    const body = await req.json();
    const {
      nickname,
      firstname,
      lastname,
      company,
      state,
      city,
      address,
      postalCode,
      phone,
      email,
    } = body;

    // Validation
    const requiredFields = [
      { field: firstname, name: "firstname" },
      { field: lastname, name: "lastname" },
      { field: state, name: "state" },
      { field: city, name: "city" },
      { field: address, name: "address" },
      { field: postalCode, name: "postalCode" },
      { field: phone, name: "phone" },
      { field: email, name: "email" },
    ];

    for (const item of requiredFields) {
      if (!item.field || item.field.trim() === "") {
        return Response.json(
          { message: `"${item.name}" is required` },
          { status: 400 },
        );
      }
    }

    if (!validateEmail(email))
      return Response.json(
        { message: "Invalid email format" },
        { status: 400 },
      );
    if (!validatePhone(phone))
      return Response.json(
        { message: "Phone number must be 11 digits and start with 09" },
        { status: 400 },
      );

    await AddressModel.create({
      userID: user._id,
      nickname: nickname ? nickname : address,
      firstname,
      lastname,
      company,
      state,
      city,
      address,
      postalCode,
      phone,
      email,
    });
    return Response.json(
      { message: "Address created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    await connectToDB();
    const user = await authUser();
    if (!user)
      return Response.json({ message: "User not found!" }, { status: 403 });

    const addresses = await AddressModel.find({ userID: user._id });
    return Response.json({ addresses });
  } catch (error) {
    return Response.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
