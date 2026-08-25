import React from "react";
import styles from "./adminPanelLayout.module.css";
import ClientWrapper from "@/components/templates/p-admin/wrapper/ClientWrapper";
import { authUser } from "@/utils/auth";
import { redirect } from "next/navigation";

const AdminPanelLayout = async ({ children }) => {
  const user = await authUser();

  if (!user) {
    return redirect("/login-register");
  }

  if (user.role !== "ADMIN") {
    return redirect("/p-user");
  }

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <ClientWrapper>{children}</ClientWrapper>
      </section>
    </div>
  );
};

export default AdminPanelLayout;
