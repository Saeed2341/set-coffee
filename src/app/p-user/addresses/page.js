import styles from "@/styles/p-user/addresses.module.css";
import AddressList from "@/components/templates/p-user/addresses/AddressList";
import connectToDB from "@/configs/db";
import AddressModel from "@/models/Address";
import { authUser } from "@/utils/auth";

const page = async () => {
  await connectToDB();
  const user = await authUser();

  const addresses = await AddressModel.find({ userID: user._id })
    .sort({ _id: -1 })
    .lean();

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>آدرس‌های من</h1>
        <span className={styles.count}>
          {addresses.length} {addresses.length === 1 ? "آدرس" : "آدرس"}
        </span>
      </div>

      <AddressList addresses={JSON.parse(JSON.stringify(addresses))} />
    </main>
  );
};

export default page;
