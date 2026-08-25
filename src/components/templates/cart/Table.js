"use client";
import Link from "next/link";
import styles from "./table.module.css";
import totalStyles from "./totals.module.css";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import stateData from "@/utils/stateData";
import Select from "react-select";
import { TbShoppingCartX } from "react-icons/tb";

const stateOptions = stateData();

const Table = () => {
  const [cart, setCart] = useState([]);
  const [stateSelectedOption, setStateSelectedOption] = useState(null);
  const [changeAddress, setChangeAddress] = useState(false);
  const [discount, setDiscount] = useState("");
  const [isValidDiscount, setIsValidDiscount] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);
  }, []);

  useEffect(calcTotalPrice, [cart]);
  function calcTotalPrice() {
    let price = 0;

    if (cart.length) {
      price = cart.reduce(
        (prev, current) => prev + current.price * current.count,
        0,
      );
    }

    setTotalPrice(price);
  }

  // const checkDiscount = async () => {
  //   if (!discount || !discount.length) {
  //     return showSwal("لطفا کد تخفیف را وارد کنید", "error", "تلاش مجدد");
  //   }

  //   const res = await fetch("/api/discounts/use", {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ code: discount }),
  //   });

  //   if (res.status == 404) {
  //     return showSwal("کد تخفیف یافت نشد", "error", "تلاش مجدد");
  //   }
  //   if (res.status == 422) {
  //     return showSwal("کد تخفیف منقضی شده", "error", "تلاش مجدد");
  //   }
  //   const discountCode = await res.json();

  //   const newPrice = totalPrice - (totalPrice * discountCode.percent) / 100;
  //   setTotalPrice(newPrice);
  //   setIsValidDiscount(true);
  //   return showSwal("کد تخفیف با موفقیت اعمال شد", "success", "تایید");
  // };

  const deleteFromCart = (productID) => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      const cart = JSON.parse(cartData);
      const deleteItem = cart.find((product) => product.id == productID);

      const newCart = cart.filter((product) => product.id != deleteItem.id);
      localStorage.setItem("cart", JSON.stringify(newCart));
      setCart(newCart);
    }
  };

  if (!cart.length)
    return (
      <div
        className={styles.cart_empty}
        data-aos="fade-up"
        suppressHydrationWarning
      >
        <TbShoppingCartX />
        <p>سبد خرید شما در حال حاضر خالی است. </p>
        <span>
          قبل از تسویه حساب، باید چند محصول را به سبد خرید خود اضافه کنید.
        </span>
        <span>در صفحه "فروشگاه"، محصولات جالب زیادی خواهید یافت.</span>
        <div>
          <Link href="/category">بازگشت به فروشگاه</Link>
        </div>
      </div>
    );
  return (
    <>
      {" "}
      <div className={styles.tabel_container}>
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th> جمع جزء</th>
                <th>تعداد</th>
                <th>قیمت</th>
                <th>محصول</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    {(item.count * item.price).toLocaleString("fa-IR")} تومان
                  </td>
                  <td className={styles.counter}>
                    <div>
                      <p>{item.count.toLocaleString("fa-IR")}</p>
                    </div>
                  </td>
                  <td className={styles.price}>
                    {item.price.toLocaleString("fa-IR")} تومان
                  </td>
                  <td className={styles.product}>
                    <Link href={`/product/${item.id}`}>{item.name}</Link>

                    {item.img ? (
                      <img src={item.img} alt={item.name} />
                    ) : (
                      <img
                        src="https://set-coffee.com/wp-content/uploads/2021/10/041-430x430.png"
                        alt={item.name}
                      />
                    )}
                  </td>

                  <td>
                    <IoMdClose
                      onClick={() => deleteFromCart(item.id)}
                      className={styles.delete_icon}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <section>
            <button className={styles.update_btn}> بروزرسانی سبد خرید</button>
            <div>
              <button onClick={checkDiscount} className={styles.set_off_btn}>
                اعمال کوپن
              </button>
              <input
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
                type="text"
                placeholder="کد تخفیف"
              />
            </div>
          </section> */}
        </>
      </div>
      <div className={totalStyles.totals}>
        <p className={totalStyles.totals_title}>جمع کل سبد خرید</p>

        <div className={totalStyles.subtotal}>
          <p>جمع جزء </p>
          <p>205,000 تومان</p>
        </div>

        <p className={totalStyles.motor}>
          {" "}
          پیک موتوری: <strong> 30,000 </strong>
        </p>
        <div className={totalStyles.address}>
          <p>حمل و نقل </p>
          <span>حمل و نقل به تهران (فقط شهر تهران).</span>
        </div>
        <p
          onClick={() => setChangeAddress((prev) => !prev)}
          className={totalStyles.change_address}
        >
          تغییر آدرس
        </p>
        {changeAddress && (
          <div className={totalStyles.address_details}>
            <Select
              defaultValue={stateSelectedOption}
              onChange={setStateSelectedOption}
              isClearable={true}
              placeholder={"استان"}
              isRtl={true}
              isSearchable={true}
              options={stateOptions}
            />
            <input type="text" placeholder="شهر" />
            <input type="number" placeholder="کد پستی" />
            <button onClick={() => setChangeAddress(false)}>بروزرسانی</button>
          </div>
        )}

        <div className={totalStyles.total}>
          <p>مجموع</p>
          <p>{totalPrice.toLocaleString("fa-IR")} تومان</p>
        </div>
        <Link
          href={
            isValidDiscount ? `/checkout?discount=${discount}` : "/checkout"
          }
        >
          <button className={totalStyles.checkout_btn}>
            ادامه جهت تصویه حساب
          </button>
        </Link>
      </div>
    </>
  );
};

export default Table;
