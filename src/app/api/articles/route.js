import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { authAdmin } from "@/utils/auth";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const articles = await ArticleModel.find({}).sort({ _id: -1 }).lean();
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error! " + error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const admin = await authAdmin();
    if (!admin) {
      return NextResponse.json(
        { message: "This api protected and you can't access it !" },
        { status: 401 },
      );
    }

    await connectToDB();
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

    const existing = await ArticleModel.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { message: "The slug is a duplicate!" },
        { status: 409 },
      );
    }

    // --- آپلود تصویر به Cloudinary ---
    let imageUrl = "";
    if (img) {
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

    const article = await ArticleModel.create({
      title,
      slug,
      description,
      content,
      author,
      img: imageUrl, // ← آدرس کامل تصویر
      tags,
      status: status ? status : "draft",
    });

    return NextResponse.json(
      { message: "Article created successfully", article },
      { status: 201 },
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Internal server error! " + error.message },
      { status: 500 },
    );
  }
}
