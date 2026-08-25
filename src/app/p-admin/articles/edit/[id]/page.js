import ArticleForm from "@/components/templates/p-admin/articles/ArticleForm";
import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { authAdmin } from "@/utils/auth";
import { redirect } from "next/navigation";

const page = async ({ params }) => {
  const { id } = await params;
  const admin = await authAdmin();
  if (!admin) redirect("/login-register");

  await connectToDB();
  const article = await ArticleModel.findById(id).lean();

  if (!article) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#e74c3c" }}>
        مقاله‌ای با این شناسه یافت نشد.
      </div>
    );
  }

  return <ArticleForm article={JSON.parse(JSON.stringify(article))} />;
};

export default page;
