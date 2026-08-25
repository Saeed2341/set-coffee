import React from "react";
import Table from "@/components/templates/p-admin/comments/Table";
import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";

const page = async ({ searchParams }) => {
  await connectToDB();

  // ===== دریافت پارامترها =====
  const { 
    page = 1, 
    limit = 10, 
    status = "all", 
    tab = "products", 
    search = "" 
  } = await searchParams;

  const skip = (page - 1) * limit;

  // ===== ساخت فیلتر اصلی =====
  const filter = { isAnswer: false };

  // ===== ۱. فیلتر بر اساس تب (نوع هدف) =====
  if (tab === "products") {
    filter.targetType = "Product";
  } else if (tab === "articles") {
    filter.targetType = "Article";
  }

  // ===== ۲. فیلتر بر اساس وضعیت =====
  if (status && status !== "all") {
    if (status === "answered") {
      filter.hasAnswer = true;
    } else {
      filter.status = status;
    }
  }

  // ===== ۳. فیلتر جستجو =====
  if (search && search.trim()) {
    filter.$or = [
      { username: { $regex: search, $options: "i" } },
      { body: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // ===== اجرای کوئری =====
  const [comments, commentsCount] = await Promise.all([
    CommentModel.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("targetId", "name title")
      .sort({ _id: -1 })
      .lean(),
    CommentModel.countDocuments(filter),
  ]);

  const totalPage = Math.ceil(commentsCount / limit);

  return (
    <main>
      <Table
        page={parseInt(page)}
        totalPage={totalPage}
        commentsCount={commentsCount}
        comments={JSON.parse(JSON.stringify(comments))}
        title="لیست کامنت‌ها"
        currentFilter={status}
        currentTab={tab}
        searchTerm={search}
      />
    </main>
  );
};

export default page;