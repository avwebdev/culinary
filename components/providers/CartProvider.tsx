"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

type CartMenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  schoolId: string | null;
  categoryId: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  school?: {
    id: string;
    name: string;
  } | null;
};

type CartItem = {
  id: string;
  quantity: number;
  specialInstructions: string | null;
  customizations: Record<string, unknown> | null;
  totalPrice: number;
  menuItem: CartMenuItem | null;
};

type Cart = {
  id: string;
  userId: string;
  schoolId: string | null;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
};

type CartContextValue = {
  cart: Cart | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  addItem: (payload: { menuItemId: string; quantity?: number; specialInstructions?: string; customizations?: Record<string, unknown> }) => Promise<void>;
  updateItem: (itemId: string, payload: { quantity: number; specialInstructions?: string; customizations?: Record<string, unknown> }) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new Error("unauthorized");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error ?? "Request failed");
  }

  return data as T;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (status !== "authenticated") {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const data = await request<{ cart: Cart }>("/api/cart");
      setCart(data.cart);
    } catch (error) {
      if (error instanceof Error && error.message === "unauthorized") {
        setCart(null);
        return;
      }

      toast({
        title: "Unable to load cart",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      void refresh();
    } else if (status === "unauthenticated") {
      setCart(null);
    }
  }, [status, refresh]);

  const addItem = useCallback<CartContextValue["addItem"]>(
    async ({ menuItemId, quantity = 1, specialInstructions, customizations }) => {
      if (status !== "authenticated") {
        toast({
          title: "Sign in required",
          description: "Please sign in to add items to your cart.",
          variant: "destructive",
        });
        throw new Error("unauthorized");
      }

      const data = await request<{ cart: Cart }>("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          menuItemId,
          quantity,
          specialInstructions,
          customizations,
        }),
      });

      setCart(data.cart);
    },
    [status]
  );

  const updateItem = useCallback<CartContextValue["updateItem"]>(
    async (itemId, { quantity, specialInstructions, customizations }) => {
      if (status !== "authenticated") {
        throw new Error("unauthorized");
      }

      const data = await request<{ cart: Cart }>(`/api/cart/item/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity, specialInstructions, customizations }),
      });

      setCart(data.cart);
    },
    [status]
  );

  const removeItem = useCallback<CartContextValue["removeItem"]>(
    async (itemId) => {
      if (status !== "authenticated") {
        throw new Error("unauthorized");
      }

      const data = await request<{ cart: Cart }>(`/api/cart/item/${itemId}`, {
        method: "DELETE",
      });

      setCart(data.cart);
    },
    [status]
  );

  const value = useMemo<CartContextValue>(
    () => ({ cart, isLoading, refresh, addItem, updateItem, removeItem }),
    [cart, isLoading, refresh, addItem, updateItem, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
