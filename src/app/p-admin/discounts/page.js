import Table from "@/components/templates/p-admin/discounts/Table";
import styles from "@/components/templates/p-admin/discounts/table.module.css";
import connectToDB from "@/configs/db";
import DiscountModel from "@/models/Discount";
import AddDiscount from "@/components/templates/p-admin/discounts/AddDiscount";

const Discounts = async ({ searchParams }) => {
  await connectToDB();

  const { search = "" } = await searchParams;

  // ===== ساخت فیلتر جستجو =====
  const filter = {};
  if (search && search.trim()) {
    filter.$or = [
      { code: { $regex: search, $options: "i" } },
      // در صورت نیاز به جستجو در فیلدهای دیگر
    ];
  }

  const discounts = await DiscountModel.find(filter)
    .sort({ _id: -1 })
    .lean();

  return (
    <main>
      <AddDiscount />
      {discounts.length === 0 ? (
        <p className={styles.empty}>کد تخفیفی وجود ندارد</p>
      ) : (
        <Table
          discounts={JSON.parse(JSON.stringify(discounts))}
          title="لیست تخفیفات"
          searchTerm={search}
        />
      )}
    </main>
  );
};

export default Discounts;