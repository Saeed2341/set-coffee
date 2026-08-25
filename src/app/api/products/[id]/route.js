import connectToDB from "@/configs/db";
import ProductModel from "@/models/Product";
import { isValidObjectId } from "mongoose";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { authAdmin } from "@/utils/auth";
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const isAdmin = await authAdmin();
    if (!isAdmin)
      return Response.json(
        { message: "This api protected and you can't access it !" },
        { status: 403 },
      );
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return Response.json({ message: "ID is not valid!" }, { status: 422 });
    }
    const product = await ProductModel.findOne({ _id: id });
    if (!product) {
      return Response.json({ message: "Product not found!" }, { status: 404 });
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const shortDescription = formData.get("shortDescription");
    const longDescription = formData.get("longDescription");
    const weight = formData.get("weight");
    const suitableFor = formData.get("suitableFor");
    const smell = formData.get("smell");
    const tags = formData.get("tags");
    const img = formData.get("img");

    let fileName = product?.img;
    if (img) {
      if (product.img) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          "uploads",
          product.img,
        );
        try {
          await unlink(oldPath);
        } catch (err) {
          if (err.code === "ENOENT") {
            return;
          }
          console.error("Error deleting old product image:", err.message);
        }
      }

      const buffer = Buffer.from(await img.arrayBuffer());
      const extName = "." + img.type.slice(6);
      fileName = Math.floor(Math.random() * Date.now()) + extName;
      writeFile(
        path.join(process.cwd(), "public", "uploads", fileName),
        buffer,
      );
    }

    await ProductModel.findOneAndUpdate(
      { _id: id },
      {
        name,
        price,
        shortDescription,
        longDescription,
        weight,
        suitableFor,
        smell,
        tags,
        img: fileName,
      },
    );

    return Response.json({ message: "Product updated successfully" });
  } catch (error) {
    return Response.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
