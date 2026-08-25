import connectToDB from "@/configs/db";
import AddressModel from "@/models/Address";
import { authUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const user = await authUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addresses = await AddressModel.find({ userID: user._id })
      .sort({ _id: -1 })
      .lean();

    return NextResponse.json({ addresses });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const user = await authUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const required = [
      "firstname",
      "lastname",
      "state",
      "city",
      "address",
      "postalCode",
      "phone",
      "email",
    ];
    for (const field of required) {
      if (!body[field] || body[field].trim() === "") {
        return NextResponse.json(
          { message: `The ${field} field is empty` },
          { status: 422 },
        );
      }
    }

    const address = await AddressModel.create({
      ...body,
      userID: user._id,
    });

    return NextResponse.json(
      { message: "Address created successfully", address },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
