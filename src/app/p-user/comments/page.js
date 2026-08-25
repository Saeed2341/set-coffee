import DataTable from "@/components/templates/p-user/comments/DataTable";
import React from "react";
import connectToDB from "@/configs/db";
import Commentmodel from "@/models/Comment";
import { authUser } from "@/utils/auth";

const page = async () => {
  connectToDB();
  const user = await authUser();
  const comments = await Commentmodel.find(
    { userID: String(user._id) },
    "-__v",
  ).populate("targetId", "name");

  return (
    <main>
      <DataTable
        comments={JSON.parse(JSON.stringify(comments))}
        title="لیست کامنت‌ها"
      />
    </main>
  );
};

export default page;
