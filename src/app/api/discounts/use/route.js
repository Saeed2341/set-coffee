import connectToDB from "@/configs/db";
import DiscountModel from "@/models/Discount";

export async function PUT(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { code } = body;

    if (!code || !code.length) {
      return Response.json({ message: "Code is required!" }, { status: 400 });
    }

    const discount = await DiscountModel.findOne({ code });

    if (!discount) {
      return Response.json({ message: "Code not found!" }, { status: 404 });
    }
    if (discount.uses >= discount.maxUse) {
      return Response.json({ message: "Code usage limit!" }, { status: 422 });
    }

    // await DiscountModel.findOneAndUpdate(
    //   { _id: discount._id },
    //   {
    //     $inc: { uses: 1 },
    //   },
    // );
    return Response.json(discount);
  } catch (err) {
    return Response.json(
      { message: "Internal server error!" },
      { status: 500 },
    );
  }
}
