import React from "react";
import { Metadata } from "next";
import { Wishlist } from "apps/user-ui/src/components/Wishlist";

export const metadata: Metadata = {
  title: "Wishlist Page | NextCommerce Nextjs E-commerce template",
  description: "This is Wishlist Page for NextCommerce Template",
  // other metadata
};

const WishlistPage = () => {
  return (
    <main className="mt-32">
      <Wishlist />
    </main>
  );
};

export default WishlistPage;
