"use client";
import { FaFacebookF, FaStar, FaRegStar, FaTwitter } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { TbSwitch3 } from "react-icons/tb";
import { FaTelegram, FaLinkedinIn, FaPinterest } from "react-icons/fa";
import styles from "./details.module.css";
import Breadcrumb from "./Breadcrumb";
import AddToWishlist from "./WishlistButton";
import { useState } from "react";
import { showSwal } from "@/utils/helper";
import { CiHeart } from "react-icons/ci";

const Details = ({ product }) => {
  const [count, setCount] = useState(1);

  const minusCount = () => {
    if (count < 1) setCount(0);
    else setCount(count - 1);
  };
  const addCount = () => setCount(count + 1);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length) {
      const isInCart = cart.some((item) => item.id == product._id);
      if (isInCart) {
        cart.forEach((item) => {
          if (item.id == product._id) {
            item.count = item.count + count;
          }
        });
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        const cartItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          count,
        };
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } else {
      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        img: product.img,
        count,
      };

      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    showSwal("محصول با موفقیت به سبد خرید اضافه شد", "success", "تایید");
  };

  return (
    <main>
      <Breadcrumb title={product.name} />
      <h2>{product.name}</h2>

      <div className={styles.rating}>
        <div>
          {new Array(product.score).fill(0).map((score, index) => (
            <FaStar key={index} />
          ))}
          {new Array(5 - product.score).fill(0).map((score, index) => (
            <FaRegStar key={index} />
          ))}
        </div>
        <p>
          (دیدگاه{" "}
          {product.comments.filter((comment) => comment.isAccept).length} کاربر)
        </p>
      </div>

      <p className={styles.price}>
        {product.price.toLocaleString("fa-IR")} تومان
      </p>
      <span className={styles.description}>{product.shortDescription}</span>

      <hr />

      <div className={styles.Available}>
        <IoCheckmark />
        <p>موجود در انبار</p>
      </div>

      <div className={styles.cart}>
        <button onClick={addToCart}>افزودن به سبد خرید</button>
        <div>
          <span onClick={minusCount}>-</span>
          {count}
          <span onClick={addCount}>+</span>
        </div>
      </div>

      <section className={styles.wishlist}>
        <AddToWishlist action="add" productID={product._id}>
          <CiHeart />
          <button>افزودن به علاقه مندی ها</button>
        </AddToWishlist>
        <div>
          <TbSwitch3 />
          <a href="/">مقایسه</a>
        </div>
      </section>

      <hr />

      <div className={styles.details}>
        <strong>شناسه محصول: {product._id}</strong>
        <p>
          {" "}
          <strong>دسته:</strong> Coffee Capsule, کپسول قهوه, همه موارد
        </p>
        <p>
          <strong>برچسب:</strong> {product.tags.join(", ")}
        </p>
      </div>

      <div className={styles.share}>
        <p>به اشتراک گذاری: </p>
        <a href="/">
          <FaTelegram />
        </a>
        <a href="/">
          <FaLinkedinIn />
        </a>
        <a href="/">
          <FaPinterest />
        </a>
        <a href="/">
          <FaTwitter />
        </a>
        <a href="/">
          <FaFacebookF />
        </a>
      </div>

      <hr />
    </main>
  );
};

export default Details;
