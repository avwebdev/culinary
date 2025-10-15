import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { categoryInputSchema } from "@/lib/validators/category";

export async function GET() {
  try {
    const items = await db.query.categories.findMany({
      orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.name)],
    });

    return NextResponse.json({ categories: items });
  } catch (error) {
    console.error("GET /api/categories error", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const json = await request.json();
    const payload = categoryInputSchema.parse(json);

    const [created] = await db
      .insert(categories)
      .values({
        name: payload.name,
        description: payload.description,
        sortOrder: payload.sortOrder,
        isActive: payload.isActive,
      })
      .returning();

    return NextResponse.json({ category: created });
  } catch (error) {
    console.error("POST /api/categories error", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
