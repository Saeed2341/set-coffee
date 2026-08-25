import connectToDB from "@/configs/db";
import AddressModel from "@/models/Address";
import { authUser } from "@/utils/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID is not valid!" },
        { status: 422 },
      );
    }

    await connectToDB();
    const user = await authUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const address = await AddressModel.findOne({
      _id: id,
      userID: user._id,
    }).lean();

    if (!address) {
      return NextResponse.json(
        { message: "Address not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json({ address });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID is not valid!" },
        { status: 422 },
      );
    }

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

    const address = await AddressModel.findOneAndUpdate(
      { _id: id, userID: user._id },
      body,
      { new: true, runValidators: true },
    );

    if (!address) {
      return NextResponse.json(
        { message: "Address not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}

// ===== DELETE: حذف آدرس =====
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID is not valid!" },
        { status: 422 },
      );
    }

    await connectToDB();
    const user = await authUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const address = await AddressModel.findOneAndDelete({
      _id: id,
      userID: user._id,
    });

    if (!address) {
      return NextResponse.json(
        { message: "Address not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Address removed successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
