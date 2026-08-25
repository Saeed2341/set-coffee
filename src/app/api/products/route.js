import { authAdmin } from "@/utils/auth";
import connectToDB from "../../../../configs/db";
import ProductModel from "@/models/Product";
import { isValidObjectId } from "mongoose";
import { writeFile } from "fs/promises";
import path from "path";
export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin)
      throw new Error("This api protected and you can't access it !");
    await connectToDB();
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

    const buffer = Buffer.from(await img.arrayBuffer());
    const extName = "." + img.type.slice(6);
    const fileName = Math.floor(Math.random() * Date.now()) + extName;
    writeFile(path.join(process.cwd(), "public", "uploads", fileName), buffer);

    const product = await ProductModel.create({
      name,
      price,
      shortDescription,
      longDescription,
      weight,
      suitableFor,
      smell,
      tags: tags,
      img: fileName,
    });

    return Response.json(
      { message: "Product created successfully", product },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error. " + error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const img = formData.get("img");

    if (!img) {
      return Response.json({ message: "Image not found" }, { status: 409 });
    }

    const buffer = Buffer.from(await img.arrayBuffer());
    const extName = "." + img.type.slice(6);
    const fileName = Math.floor(Math.random() * Date.now()) + extName;

    writeFile(path.join(process.cwd(), "public", "uploads", fileName), buffer);

    return Response.json(
      { message: "Image uploaded successfully" },
      { status: 201 },
    );
  } catch (err) {}
  return Response.json(
    { message: "Internal server error. " + error.message },
    { status: 409 },
  );
}

export async function GET(req) {
  const products = await ProductModel.find({}, "-__v").populate("comments");
  return Response.json({ products });
}

export async function DELETE(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin)
      throw new Error("This api protected and you can't access it !");
    await connectToDB();
    const body = await req.json();
    const { id } = body;

    if (!isValidObjectId(id)) {
      return Response.json({ message: "ID is not valid!" }, { status: 409 });
    }

    const product = await ProductModel.findOneAndDelete({ _id: id });
    if (!product) {
      return Response.json({ message: "Product not found!" }, { status: 404 });
    }

    return Response.json({ message: "Product removed successfully" });
  } catch (error) {
    return Response.json(
      {
        message: "Internal server error. " + error.message,
      },
      { status: 500 },
    );
  }
}
