"use client";
import { useEffect } from "react";

const ClearCart = ({ shouldClear }) => {
  useEffect(() => {
    if (shouldClear) {
      localStorage.removeItem("cart");
    }
  }, [shouldClear]);

  return null;
};

export default ClearCart;
