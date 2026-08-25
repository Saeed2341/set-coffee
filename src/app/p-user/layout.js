import styles from "@/styles/p-user/userPanelLayout.module.css";
import ClientWrapper from "@/components/templates/p-user/wrapper/ClientWrapper";
import { authUser } from "@/utils/auth";
import { redirect } from "next/navigation";

const UserPanelLayout = async ({ children }) => {
  const user = await authUser();

  if (!user) {
    return redirect("/login-register");
  }

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <ClientWrapper user={{ name: user.name, role: user.role }}>
          {children}
        </ClientWrapper>
      </section>
    </div>
  );
};

export default UserPanelLayout;
