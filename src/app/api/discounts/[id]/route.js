import connectToDB from "@/configs/db";
import DiscountModel from "@/models/Discount";
import { authAdmin } from "@/utils/auth";
import { isValidObjectId } from "mongoose";

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      return Response.json(
        { message: "This api protected and you can't access it !" },
        { status: 403 },
      );
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return Response.json({ message: "ID is not valid!" }, { status: 409 });
    }

    const deletedDiscount = await DiscountModel.findOneAndDelete({ _id: id });
    if (!deletedDiscount)
      return Response.json(
        { message: "Discount code not found!" },
        { status: 404 },
      );

    return Response.json({
      message: "Discount code deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    return Response.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
