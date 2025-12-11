import React from "react";

import { Metadata } from "next";
import Cart from "apps/user-ui/src/components/Cart";
export const metadata: Metadata = {
  title: "Cart Page | NextCommerce Nextjs E-commerce template",
  description: "This is Cart Page for NextCommerce Template",
  // other metadata
};

const CartPage = () => {
  return (
    <div className="mt-32">
      <Cart />
    </div>
  );
};

export default CartPage;
