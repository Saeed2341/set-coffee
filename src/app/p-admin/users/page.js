import React from "react";
import styles from "@/components/templates/p-admin/users/table.module.css";
import Table from "@/components/templates/p-admin/users/Table";
import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import AddUser from "@/components/templates/p-admin/users/AddUser";

const page = async ({ searchParams }) => {
  connectToDB();
  const users = await UserModel.find({}).lean();
  const { mode, id } = await searchParams;

  let user;
  if (mode == "edit") {
    if (!id) return;

    user = await UserModel.findOne({ _id: id }).lean();
    if (!user) return;
  }

  return (
    <main>
      <AddUser
        user={user ? JSON.parse(JSON.stringify(user)) : null}
        mode={mode || "create"}
      />
      {users.length === 0 ? (
        <p className={styles.empty}>کاربری وجود ندارد</p>
      ) : (
        <Table users={JSON.parse(JSON.stringify(users))} title="لیست کاربران" />
      )}
    </main>
  );
};

export default page;
