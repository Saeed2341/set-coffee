import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Stepper from "@/components/modules/stepper/Stepper";
import styles from "@/styles/checkout.module.css";
import { authUser } from "@/utils/auth";
import CheckoutWrapper from "@/components/templates/checkout/CheckoutWrapper";
import { redirect } from "next/navigation";
import MobileNav from "@/components/modules/mobileNav/MobileNav";
const page = async () => {
  const user = await authUser();
  if (!user) return redirect("/login-register");
  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        isAdmin={user && user.role === "ADMIN" ? true : false}
        userID={user && user._id.toString()}
      />
      <Stepper step="checkout" />
      <div className={styles.container}>
        <main className={styles.checkout}>
          <CheckoutWrapper user={JSON.parse(JSON.stringify(user))} />
        </main>
      </div>
      <Footer />
      <MobileNav
        isLogin={user ? true : false}
        isAdmin={user?.role == "ADMIN" ? true : false}
      />
    </>
  );
};

export default page;
