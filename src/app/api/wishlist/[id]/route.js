import connectToDB from "@/configs/db";
import WishlistModel from "@/models/Wishlist";
import { authUser } from "@/utils/auth";
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const user = await authUser();
    if (!user) {
      return Response.json({ message: "Please login first!" }, { status: 401 });
    }

    const { id } = await params;
    await WishlistModel.findOneAndDelete({ productID: id, userID: user._id });
    return Response.json({ message: "Product removed successfully " });
  } catch (error) {
    return Response.json(
      { message: "Internal server error", error },
      { status: 500 },
    );
  }
}

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const user = await authUser();
    if (!user) {
      return Response.json({ message: "Please login first!" }, { status: 401 });
    }

    const { id } = await params;
    const wishlistCount = await WishlistModel.countDocuments({ userID: id });

    return Response.json({ wishlistCount });
  } catch (error) {
    return Response.json(
      {
        message: "Internal server error: " + error.message,
      },
      { status: 500 },
    );
  }
}
