"use client";
import { useState } from "react";
import Order from "./order/Order";
import Details from "./details/Details";

const CheckoutWrapper = ({ user }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    company: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
    phone: "",
    email: "",
    notes: "",
    nickname: "",
  });

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (cartItems, discountCode, isDiscountApplied) => {
    const requiredFields = [
      "firstname",
      "lastname",
      "state",
      "city",
      "address",
      "postalCode",
      "phone",
      "email",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return swal({
          title: "خطا!",
          text: "!فیلدهای ستاره دار نمیتوانند خالی باشند",
          icon: "error",
          buttons: "تایید",
        });
      }
    }
    if (!cartItems || cartItems.length === 0) {
      return swal({
        title: "خطا!",
        text: "سبد خرید خالی است",
        icon: "error",
        buttons: "تایید",
      });
    }

    console.log(discountCode, isDiscountApplied);
    const payload = {
      userID: user._id,
      items: cartItems.map((item) => ({
        productID: item.id,
        quantity: item.count,
      })),
      shippingAddress: {
        firstname: formData.firstname,
        lastname: formData.lastname,
        company: formData.company || "",
        state: formData.state,
        city: formData.city,
        address: formData.address,
        postalCode: formData.postalCode,
        phone: formData.phone,
        email: formData.email,
      },
      notes: formData.notes || "",
      discountCode: isDiscountApplied ? discountCode : null,
    };
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.paymentUrl || "/complate-order";
      } else {
        swal({
          title: "خطا!",
          text: data.message || "خطا در ثبت سفارش",
          icon: "error",
          buttons: "تایید",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      swal({
        title: "خطا!",
        text: "مشکل در ارتباط با سرور",
        icon: "error",
        buttons: "تایید",
      });
    }
  };

  return (
    <>
      <Order handleSubmit={handleSubmit} />
      <Details formData={formData} updateForm={updateForm} />
    </>
  );
};

export default CheckoutWrapper;
