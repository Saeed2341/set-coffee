"use client";
import { showSwal } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function WishlistButton({ children, productID, action }) {
  const [user, setUser] = useState({});

  const router = useRouter();
  useEffect(() => {
    const authUser = async () => {
      const res = await fetch("/api/auth/me");
      if (res.status == 200) {
        const data = await res.json();
        setUser({ ...data });
      }
    };

    authUser();
  }, []);

  const addToWishlist = async () => {
    if (!user?._id) {
      return showSwal(
        "برای افزودن به علاقمندی ها ابتدا وارد سایت شوید",
        "error",
        "تایید",
      );
    }

    const wish = {
      userID: user._id,
      productID,
    };

    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wish),
    });

    if (res.status == 201) {
      return showSwal(
        "محصول با موفقیت به علاقمندی‌ها اضافه شد",
        "success",
        "تایید",
      );
    } else {
      return showSwal("لطفا مجدد تلاش کنید", "error", "تلاش مجدد");
    }
  };

  const removeFromWishlist = async () => {
    if (!user?._id) {
      return showSwal(
        "برای افزودن به علاقمندی ها ابتدا وارد سایت شوید",
        "error",
        "تایید",
      );
    }

    swal({
      title: "آیا از حذف محصول از علاقمندی ها اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch(`/api/wishlist/${productID}`, {
          method: "DELETE",
        });

        if (res.status == 200) {
          swal({
            title: "محصول با موفقیت از لیست علاقمندی ها حذف شد",
            icon: "success",
            buttons: "تایید",
          }).then(() => router.refresh());
        } else {
          swal({
            title: "خطا در حذف محصول!",
            icon: "error",
            buttons: "تلاش مجدد",
          });
        }
      }
    });
  };
  if (action == "add") {
    return <div onClick={addToWishlist}>{children}</div>;
  } else if (action == "remove") {
    return <div onClick={removeFromWishlist}>{children}</div>;
  } else {
    return null;
  }
}

export default WishlistButton;
