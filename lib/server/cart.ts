import { db } from "@/lib/db";
import { cartItems, carts } from "@/lib/schema";
import { eq } from "drizzle-orm";

type CartRecord = NonNullable<Awaited<ReturnType<typeof fetchCartById>>>;

type SerializedCartItem = {
  id: string;
  quantity: number;
  specialInstructions: string | null;
  customizations: Record<string, unknown> | null;
  totalPrice: number;
  menuItem: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    isAvailable: boolean;
    isFeatured: boolean;
    schoolId: string | null;
    categoryId: string | null;
  category: CartRecord["cartItems"][number]["menuItem"]["category"] | null;
  school: CartRecord["cartItems"][number]["menuItem"]["school"] | null;
  } | null;
};

type SerializedCart = {
  id: string;
  userId: string;
  schoolId: string | null;
  items: SerializedCartItem[];
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
};

async function fetchCartById(cartId: string) {
  return db.query.carts.findFirst({
    where: (fields, operators) => operators.eq(fields.id, cartId),
    with: {
      cartItems: {
        with: {
          menuItem: {
            with: {
              category: true,
              school: true,
            },
          },
        },
      },
      school: true,
    },
  });
}

export async function getOrCreateCart(userId: string) {
  let cart = await db.query.carts.findFirst({
    where: (fields, operators) => operators.eq(fields.userId, userId),
    with: {
      cartItems: {
        with: {
          menuItem: {
            with: {
              category: true,
              school: true,
            },
          },
        },
      },
      school: true,
    },
  });

  if (!cart) {
    const [created] = await db
      .insert(carts)
      .values({ userId, status: "active" })
      .returning();

    cart = await fetchCartById(created.id);
  }

  if (!cart) {
    throw new Error("Unable to create cart");
  }

  return cart;
}

export function serializeCart(cart: NonNullable<CartRecord>): SerializedCart {
  const items = cart.cartItems.map((item) => {
    const price = Number(item.menuItem?.price ?? 0);
    return {
      id: item.id,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions ?? null,
      customizations: (item.customizations as Record<string, unknown>) ?? null,
      totalPrice: Number((price * item.quantity).toFixed(2)),
      menuItem: item.menuItem
        ? {
            id: item.menuItem.id,
            name: item.menuItem.name,
            description: item.menuItem.description,
            price,
            image: item.menuItem.image,
            isAvailable: item.menuItem.isAvailable,
            isFeatured: item.menuItem.isFeatured,
            schoolId: item.menuItem.schoolId,
            categoryId: item.menuItem.categoryId,
            category: item.menuItem.category,
            school: item.menuItem.school,
          }
        : null,
    } as SerializedCartItem;
  });

  const subtotal = Number(
    items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
  );
  const taxRate = 0.085;
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    schoolId: cart.schoolId,
    items,
    subtotal,
    tax,
    total,
    itemCount,
  };
}

export async function refreshCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  return serializeCart(cart);
}

export async function removeCartItem(userId: string, itemId: string) {
  const cart = await getOrCreateCart(userId);
  const target = cart.cartItems.find((item) => item.id === itemId);

  if (!target) {
    return serializeCart(cart);
  }

  await db.delete(cartItems).where(eq(cartItems.id, itemId));

  const updated = await getOrCreateCart(userId);
  return serializeCart(updated);
}

export type { SerializedCart, SerializedCartItem };
