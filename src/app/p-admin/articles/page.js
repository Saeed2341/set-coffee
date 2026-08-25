import ArticleList from "@/components/templates/p-admin/articles/ArticleList";
import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { authAdmin } from "@/utils/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const admin = await authAdmin();
  if (!admin) redirect("/login-register");

  await connectToDB();
  const articles = await ArticleModel.find({}).sort({ _id: -1 }).lean();

  return <ArticleList articles={JSON.parse(JSON.stringify(articles))} />;
};

export default page;
