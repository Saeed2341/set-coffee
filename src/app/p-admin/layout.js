import styles from "@/styles/p-admin/adminPanelLayout.module.css";
import ClientWrapper from "@/components/templates/p-admin/wrapper/ClientWrapper";
import { authAdmin, authUser } from "@/utils/auth";
import { redirect } from "next/navigation";

const layout = async ({ children }) => {
  const user = await authUser();
  const admin = await authAdmin();
  if (!user) {
    return redirect("/login-register");
  }

  if (user.role !== "ADMIN") {
    return redirect("/p-user");
  }

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <ClientWrapper adminName={JSON.parse(JSON.stringify(admin.name))}>
          {children}
        </ClientWrapper>
      </section>
    </div>
  );
};

export default layout;
