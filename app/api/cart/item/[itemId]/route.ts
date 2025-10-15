import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/schema";
import { updateCartItemSchema } from "@/lib/validators/cart";
import { getOrCreateCart, serializeCart } from "@/lib/server/cart";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const payload = updateCartItemSchema.parse(body);

    const cart = await getOrCreateCart(session.user.id);
    const target = cart.cartItems.find((item) => item.id === params.itemId);

    if (!target) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    await db
      .update(cartItems)
      .set({
        quantity: payload.quantity,
        specialInstructions: payload.specialInstructions ?? target.specialInstructions,
        customizations: payload.customizations ?? target.customizations,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, params.itemId));

    const updatedCart = await getOrCreateCart(session.user.id);

    return NextResponse.json({ cart: serializeCart(updatedCart) });
  } catch (error) {
    console.error(`PATCH /api/cart/item/${params.itemId} error`, error);
    const message =
      error instanceof Error ? error.message : "Failed to update cart item";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { itemId: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await getOrCreateCart(session.user.id);
    const target = cart.cartItems.find((item) => item.id === params.itemId);

    if (!target) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    await db.delete(cartItems).where(eq(cartItems.id, params.itemId));

    const updatedCart = await getOrCreateCart(session.user.id);

    return NextResponse.json({ cart: serializeCart(updatedCart) });
  } catch (error) {
    console.error(`DELETE /api/cart/item/${params.itemId} error`, error);
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
  }
}
