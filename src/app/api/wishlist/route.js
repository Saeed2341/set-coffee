import connectToDB from "../../../../configs/db";
import WishlistModel from "@/models/Wishlist";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { productID, userID } = body;

    // Validation
    if (
      !mongoose.Types.ObjectId.isValid(productID) ||
      !mongoose.Types.ObjectId.isValid(userID)
    ) {
      return Response.json({ message: "Invalid object ID!" }, { status: 400 });
    }

    const wish = await WishlistModel.findOne({ productID });
    if (!wish) {
      await WishlistModel.create({ userID, productID });
    }

    return Response.json(
      { message: "Product added to wishlist successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error", error },
      { status: 500 },
    );
  }
}

