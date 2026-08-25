import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { authAdmin } from "@/utils/auth";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// --- GET (دریافت یک مقاله) ---
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
    const article = await ArticleModel.findById(id).lean();
    if (!article) {
      return NextResponse.json(
        { message: "Article not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error! " + error.message },
      { status: 500 },
    );
  }
}

// --- PUT (ویرایش مقاله) ---
export async function PUT(req, { params }) {
  try {
    const admin = await authAdmin();
    if (!admin) {
      return NextResponse.json(
        { message: "This api protected and you can't access it !" },
        { status: 403 },
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID is not valid!" },
        { status: 422 },
      );
    }

    await connectToDB();

    const article = await ArticleModel.findOne({ _id: id });
    if (!article) {
      return NextResponse.json(
        { message: "Article not found!" },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const content = formData.get("content");
    const status = formData.get("status");
    const author = formData.get("author");
    const img = formData.get("img");
    const tags = formData.getAll("tags");

    if (!title || !slug || !description || !content || !author) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 422 },
      );
    }

    let imageUrl = article.img; // آدرس تصویر قبلی

    // اگر تصویر جدید ارسال شده باشد
    if (img) {
      // ۱. حذف تصویر قبلی از Cloudinary (اختیاری)
      if (article.img) {
        // استخراج public_id از آدرس تصویر
        const publicId = article.img
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        try {
          await cloudinary.uploader.destroy(`set-coffee/articles/${publicId}`);
        } catch (err) {
          console.error("Error deleting old article image:", err.message);
        }
      }

      // ۲. آپلود تصویر جدید
      const buffer = Buffer.from(await img.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "set-coffee/articles",
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

    // به‌روزرسانی مقاله در دیتابیس
    await ArticleModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        slug,
        description,
        content,
        author,
        tags,
        status: status ? status : "draft",
        img: imageUrl,
      },
    );

    return NextResponse.json(
      { message: "Article updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Internal server error! " + error.message },
      { status: 500 },
    );
  }
}

// --- DELETE (حذف مقاله) ---
export async function DELETE(req, { params }) {
  try {
    const admin = await authAdmin();
    if (!admin) {
      return NextResponse.json(
        { message: "This api protected and you can't access it !" },
        { status: 401 },
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID is not valid!" },
        { status: 422 },
      );
    }

    await connectToDB();

    // ابتدا مقاله را پیدا کنید تا آدرس تصویر را داشته باشید
    const article = await ArticleModel.findById(id);
    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 },
      );
    }

    // حذف تصویر از Cloudinary (اختیاری)
    if (article.img) {
      const publicId = article.img.split("/").slice(-2).join("/").split(".")[0];
      try {
        await cloudinary.uploader.destroy(`set-coffee/articles/${publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err.message);
      }
    }

    // حذف مقاله از دیتابیس
    await ArticleModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Article removed successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error! " + error.message },
      { status: 500 },
    );
  }
}
