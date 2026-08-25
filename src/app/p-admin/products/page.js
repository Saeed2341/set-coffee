import React from "react";
import styles from "@/components/templates/p-admin/products/table.module.css";

import Table from "@/components/templates/p-admin/products/Table";
import connectToDB from "@/configs/db";
import ProductModel from "@/models/Product";
import AddProduct from "@/components/templates/p-admin/products/AddProduct";

const page = async ({ searchParams }) => {
  connectToDB();

  const { mode, id } = await searchParams;
  let product;
  if (mode == "edit") {
    if (!id) return;
    product = await ProductModel.findOne({ _id: id });
  }

  const products = await ProductModel.find().sort({ _id: -1 }).lean();

  return (
    <main>
      <AddProduct
        product={product ? JSON.parse(JSON.stringify(product)) : null}
        mode={mode || "create"}
      />
      {products.length === 0 ? (
        <p className={styles.empty}>محصولی وجود ندارد</p>
      ) : (
        <Table
          products={JSON.parse(JSON.stringify(products))}
          title="لیست محصولات "
        />
      )}
    </main>
  );
};

export default page;
