import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addToCartSchema } from "@/lib/validators/cart";
import { cartItems, carts, menuItems } from "@/lib/schema";
import { getOrCreateCart, serializeCart } from "@/lib/server/cart";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await getOrCreateCart(session.user.id);

    return NextResponse.json({ cart: serializeCart(cart) });
  } catch (error) {
    console.error("GET /api/cart error", error);
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const payload = addToCartSchema.parse(body);

    const menuItem = await db.query.menuItems.findFirst({
      where: (fields, operators) => operators.eq(fields.id, payload.menuItemId),
      with: { school: true, category: true },
    });

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    if (!menuItem.isAvailable) {
      return NextResponse.json({ error: "Item is unavailable" }, { status: 400 });
    }

    const cart = await getOrCreateCart(session.user.id);

    if (!cart.schoolId && menuItem.schoolId) {
      await db
        .update(carts)
        .set({ schoolId: menuItem.schoolId })
        .where(eq(carts.id, cart.id));
    }

    const existingItem = cart.cartItems.find(
      (item) => item.menuItemId === payload.menuItemId
    );

    if (existingItem) {
      await db
        .update(cartItems)
        .set({
          quantity: existingItem.quantity + payload.quantity,
          specialInstructions: payload.specialInstructions ?? existingItem.specialInstructions,
          customizations: payload.customizations ?? existingItem.customizations,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        cartId: cart.id,
        menuItemId: payload.menuItemId,
        quantity: payload.quantity,
        specialInstructions: payload.specialInstructions,
        customizations: payload.customizations,
      });
    }

    const updatedCart = await getOrCreateCart(session.user.id);

    return NextResponse.json({ cart: serializeCart(updatedCart) });
  } catch (error) {
    console.error("POST /api/cart error", error);
    const message = error instanceof Error ? error.message : "Failed to update cart";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
