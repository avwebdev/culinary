"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readLocalCart, setLocalSlugs, clearLocalCart } from "@/lib/local-cart";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return readLocalCart().slugs;
}

function getServerSnapshot() {
  return [] as string[];
}

export function useCart() {
  const slugs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addToCart = useCallback((uuid: string) => {
    const cart = readLocalCart();
    const newSlugs = [...cart.slugs, uuid];
    setLocalSlugs(newSlugs);
  }, []);

  const removeFromCart = useCallback((uuid: string) => {
    const cart = readLocalCart();
    const index = cart.slugs.indexOf(uuid);
    if (index !== -1) {
      const newSlugs = [...cart.slugs];
      newSlugs.splice(index, 1);
      setLocalSlugs(newSlugs);
    }
  }, []);

  const clearCart = useCallback(() => {
    clearLocalCart();
  }, []);

  return {
    slugs,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
