"use client";

import { useCart } from "@/hooks/useCart";

export default function Cart() {
  const { slugs } = useCart();

  console.log("Cart slugs:", slugs);

  return <div>Your cart contains {slugs.length} items.</div>;
}
