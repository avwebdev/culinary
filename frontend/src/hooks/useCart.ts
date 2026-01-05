"use client";

import { useEffect, useState, useCallback } from "react";
import { readLocalCart, writeLocalCart, clearLocalCart } from "@/lib/local-cart";

export type CartItem = {
  uuid: string;
};

export function useCart() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize cart from localStorage
  useEffect(() => {
    const cart = readLocalCart();
    setSlugs(cart.map((item: CartItem) => item.uuid));
    setIsLoading(false);

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = () => {
      const updatedCart = readLocalCart();
      setSlugs(updatedCart.map((item: CartItem) => item.uuid));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addToCart = useCallback((uuid: string) => {
    const cart = readLocalCart();
    cart.push({ uuid });
    writeLocalCart(cart);
    setSlugs(cart.map((item: CartItem) => item.uuid));
  }, []);

  const removeFromCart = useCallback((uuid: string) => {
    const cart = readLocalCart();
    const filtered = cart.filter((item: CartItem) => item.uuid !== uuid);
    writeLocalCart(filtered);
    setSlugs(filtered.map((item: CartItem) => item.uuid));
  }, []);

  const clearCart = useCallback(() => {
    clearLocalCart();
    setSlugs([]);
  }, []);

  return {
    slugs,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
