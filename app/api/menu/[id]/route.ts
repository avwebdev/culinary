import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { menuItems } from "@/lib/schema";
import { menuItemInputSchema } from "@/lib/validators/menu";
import { eq } from "drizzle-orm";

const menuItemUpdateSchema = menuItemInputSchema.partial();

export async function GET(_request: Request, { params }: { params: { id: string } }) {

  try {
    const item = await db.query.menuItems.findFirst({
  where: (fields, { eq }) => eq(fields.id, params.id),
      with: { category: true, school: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({
      item: {
        ...item,
        price: Number(item.price),
        allergens: item.allergens ?? [],
        nutritionInfo: item.nutritionInfo ?? {},
      },
    });
  } catch (error) {
  console.error(`GET /api/menu/${params.id} error`, error);
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {

  try {
    const session = await auth();

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const json = await request.json();
    const payload = menuItemUpdateSchema.parse(json);

    const updateValues: Record<string, unknown> = {};

    if (payload.name !== undefined) updateValues.name = payload.name;
    if (payload.description !== undefined) updateValues.description = payload.description;
    if (payload.price !== undefined) updateValues.price = payload.price.toFixed(2);
    if (payload.categoryId !== undefined) updateValues.categoryId = payload.categoryId;
    if (payload.schoolId !== undefined) updateValues.schoolId = payload.schoolId;
    if (payload.image !== undefined) updateValues.image = payload.image;
    if (payload.isAvailable !== undefined) updateValues.isAvailable = payload.isAvailable;
    if (payload.isCustomizable !== undefined) updateValues.isCustomizable = payload.isCustomizable;
    if (payload.isFeatured !== undefined) updateValues.isFeatured = payload.isFeatured;
    if (payload.allergens !== undefined) {
      updateValues.allergens = payload.allergens.length ? payload.allergens : null;
    }
    if (payload.nutritionInfo !== undefined) {
      updateValues.nutritionInfo = Object.keys(payload.nutritionInfo).length
        ? payload.nutritionInfo
        : null;
    }
    if (payload.preparationTime !== undefined) updateValues.preparationTime = payload.preparationTime;
    if (payload.sortOrder !== undefined) updateValues.sortOrder = payload.sortOrder;

    if (Object.keys(updateValues).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    const [updated] = await db
      .update(menuItems)
      .set(updateValues)
      .where(eq(menuItems.id, params.id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    const item = await db.query.menuItems.findFirst({
      where: (fields, { eq }) => eq(fields.id, params.id),
      with: { category: true, school: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Failed to load updated menu item" }, { status: 500 });
    }

    return NextResponse.json({
      item: {
        ...item,
        price: Number(item.price),
        allergens: item.allergens ?? [],
        nutritionInfo: item.nutritionInfo ?? {},
      },
    });
  } catch (error) {
  console.error(`PATCH /api/menu/${params.id} error`, error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {

  try {
    const session = await auth();

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [deleted] = await db
      .delete(menuItems)
      .where(eq(menuItems.id, params.id))
      .returning({ id: menuItems.id });

    if (!deleted) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
  console.error(`DELETE /api/menu/${params.id} error`, error);
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}
