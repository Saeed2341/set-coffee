import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();

    await CommentModel.updateMany(
      {},
      {
        $set: { status: "pending" },
        $unset: { isAccept: "" },
      },
    );

    return NextResponse.json({
      message: "Migration completed",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Migration failed: " + error.message },
      { status: 500 },
    );
  }
}
