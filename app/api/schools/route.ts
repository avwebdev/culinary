import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schools } from "@/lib/schema";
import { createSchoolSchema, updateSchoolSchema } from "@/lib/validators/school";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const includeInactive = searchParams.get("includeInactive") === "true";

    const items = await db.query.schools.findMany({
      orderBy: (fields, { asc }) => [asc(fields.name)],
      where: (fields, { eq, and }) => {
        const filters = [] as ReturnType<typeof eq>[];

        if (!includeInactive) {
          filters.push(eq(fields.isActive, true));
        }

        if (slug) {
          filters.push(eq(fields.slug, slug));
        }

        return filters.length ? and(...filters) : undefined;
      },
    });

    return NextResponse.json({ schools: items });
  } catch (error) {
    console.error("GET /api/schools error", error);
    return NextResponse.json({ error: "Failed to load schools" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check admin permissions
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to create schools" },
        { status: 401 }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const validationResult = createSchoolSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existingSchool = await db.query.schools.findFirst({
      where: (fields, { eq }) => eq(fields.slug, validationResult.data.slug),
    });

    if (existingSchool) {
      return NextResponse.json(
        { error: "A school with this slug already exists" },
        { status: 409 }
      );
    }

    // Create the school
    const [newSchool] = await db
      .insert(schools)
      .values(validationResult.data)
      .returning();

    return NextResponse.json({ school: newSchool }, { status: 201 });
  } catch (error) {
    console.error("POST /api/schools error", error);
    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}
