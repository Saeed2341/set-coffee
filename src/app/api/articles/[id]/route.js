import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { authAdmin } from "@/utils/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import path from "path";
import { writeFile, unlink } from "fs/promises";
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
      return Response.json({ message: "Article not found!" }, { status: 404 });
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

    let fileName = article?.img;
    if (img) {
      if (article.img) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          "uploads",
          "articles",
          article.img,
        );
        console.log(article.img, oldPath);
        try {
          await unlink(oldPath);
        } catch (err) {
          if (err.code === "ENOENT") {
            return;
          }
          console.error("Error deleting old article image:", err.message);
        }
      }

      const buffer = Buffer.from(await img.arrayBuffer());
      const extName = "." + img.type.slice(6);
      fileName = Math.floor(Math.random() * Date.now()) + extName;
      writeFile(
        path.join(process.cwd(), "public", "uploads", "articles", fileName),
        buffer,
      );
    }

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
        img: fileName,
      },
    );
    return NextResponse.json(article);
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Internal server error! " + error.message },
      { status: 500 },
    );
  }
}

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
    const article = await ArticleModel.findByIdAndDelete(id);
    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 },
      );
    }

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
