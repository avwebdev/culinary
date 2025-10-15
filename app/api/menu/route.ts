import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { menuItems } from "@/lib/schema";
import { menuItemInputSchema } from "@/lib/validators/menu";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get("schoolId");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const onlyAvailable = searchParams.get("available") === "true";

    const items = await db.query.menuItems.findMany({
      with: {
        category: true,
        school: true,
      },
      where: (fields, operators) => {
        const conditions: any[] = [];

        if (schoolId) {
          conditions.push(operators.eq(fields.schoolId, schoolId));
        }

        if (categoryId) {
          conditions.push(operators.eq(fields.categoryId, categoryId));
        }

        if (onlyAvailable) {
          conditions.push(operators.eq(fields.isAvailable, true));
        }

        if (search) {
          conditions.push(
            operators.ilike(fields.name, `%${search}%`)
          );
        }

        return conditions.length ? operators.and(...conditions) : undefined;
      },
      orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.name)],
    });

    const serialized = items.map((item) => ({
      ...item,
      price: Number(item.price),
      allergens: item.allergens ?? [],
      nutritionInfo: item.nutritionInfo ?? {},
    }));

    return NextResponse.json({ items: serialized });
  } catch (error) {
    console.error("GET /api/menu error", error);
    return NextResponse.json({ error: "Failed to load menu items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const json = await request.json();
    const payload = menuItemInputSchema.parse(json);

    const [created] = await db
      .insert(menuItems)
      .values({
        name: payload.name,
        description: payload.description,
        price: payload.price.toFixed(2),
        categoryId: payload.categoryId,
        schoolId: payload.schoolId,
        image: payload.image,
        isAvailable: payload.isAvailable,
        isCustomizable: payload.isCustomizable,
        isFeatured: payload.isFeatured,
        allergens: payload.allergens && payload.allergens.length ? payload.allergens : null,
        nutritionInfo:
          payload.nutritionInfo && Object.keys(payload.nutritionInfo).length
            ? payload.nutritionInfo
            : null,
        preparationTime: payload.preparationTime,
        sortOrder: payload.sortOrder,
      })
      .returning();

    const item = await db.query.menuItems.findFirst({
      where: (fields, { eq }) => eq(fields.id, created.id),
      with: { category: true, school: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
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
    console.error("POST /api/menu error", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
