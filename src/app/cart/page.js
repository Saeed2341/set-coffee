import Footer from "@/components/modules/footer/Footer";
import MobileNav from "@/components/modules/mobileNav/MobileNav";
import Navbar from "@/components/modules/navbar/Navbar";
import Stepper from "@/components/modules/stepper/Stepper";
import Table from "@/components/templates/cart/Table";
import styles from "@/styles/cart.module.css";
import { authUser } from "@/utils/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await authUser();
  // if (!user) return redirect("/login-register");
  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        isAdmin={user && user.role === "ADMIN" ? true : false}
        userID={user && user._id.toString()}
      />
      <Stepper step="cart" />

      <main className={styles.cart} data-aos="fade-up" suppressHydrationWarning>
        <Table />
      </main>

      <Footer />
           <MobileNav
        isLogin={user ? true : false}
        isAdmin={user?.role == "ADMIN" ? true : false}
      />
    </>
  );
};

export default page;
