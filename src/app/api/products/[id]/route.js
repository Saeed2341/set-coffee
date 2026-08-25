import connectToDB from "@/configs/db";
import ProductModel from "@/models/Product";
import { isValidObjectId } from "mongoose";
import { authAdmin } from "@/utils/auth";
import cloudinary from "@/utils/cloudinary";

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      return Response.json(
        { message: "This api protected and you can't access it!" },
        { status: 403 },
      );
    }

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
    const stock = formData.get("stock");
    const img = formData.get("img");

    let imageUrl = product.img; // آدرس تصویر قبلی

    // اگر تصویر جدید ارسال شده باشد
    if (img) {
      // ۱. حذف تصویر قبلی از Cloudinary (اختیاری اما توصیه می‌شود)
      if (product.img) {
        // استخراج public_id از آدرس تصویر
        const publicId = product.img
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        try {
          await cloudinary.uploader.destroy(`set-coffee/products/${publicId}`);
        } catch (err) {
          console.error("Error deleting old image:", err.message);
        }
      }

      // ۲. آپلود تصویر جدید
      const buffer = Buffer.from(await img.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "set-coffee/products",
              use_filename: true,
              unique_filename: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    // به‌روزرسانی محصول در دیتابیس
    await ProductModel.findOneAndUpdate(
      { _id: id },
      {
        name,
        price,
        shortDescription,
        longDescription,
        weight,
        stock,
        suitableFor,
        smell,
        tags,
        img: imageUrl,
      },
    );

    return Response.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    return Response.json(
      { message: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
