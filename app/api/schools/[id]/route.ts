import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schools } from "@/lib/schema";
import { updateSchoolSchema } from "@/lib/validators/school";
import { auth } from "@/lib/auth";
import { eq, and, not } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const school = await db.query.schools.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
    });

    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ school });
  } catch (error) {
    console.error(`GET /api/schools/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to retrieve school" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permissions
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to update schools" },
        { status: 401 }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const validationResult = updateSchoolSchema.safeParse({
      id: params.id,
      ...body,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, ...updateData } = validationResult.data;

    // Check if school exists
    const existingSchool = await db.query.schools.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
    });

    if (!existingSchool) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    // Check for duplicate slug (if changing slug)
    if (
      updateData.slug !== existingSchool.slug &&
      updateData.slug !== undefined
    ) {
      const duplicateSlug = await db.query.schools.findFirst({
        where: (fields, { eq, and, not }) =>
          and(eq(fields.slug, updateData.slug), not(eq(fields.id, id))),
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { error: "A school with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Update the school
    const [updatedSchool] = await db
      .update(schools)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(schools.id, id))
      .returning();

    return NextResponse.json({ school: updatedSchool });
  } catch (error) {
    console.error(`PATCH /api/schools/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to update school" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permissions
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to delete schools" },
        { status: 401 }
      );
    }

    const id = params.id;

    // Check if school exists
    const existingSchool = await db.query.schools.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
    });

    if (!existingSchool) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    // Check if school has related entities
    // For safety, we're just setting isActive to false instead of deleting
    const [updatedSchool] = await db
      .update(schools)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(schools.id, id))
      .returning();

    return NextResponse.json({ school: updatedSchool });
  } catch (error) {
    console.error(`DELETE /api/schools/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to delete school" },
      { status: 500 }
    );
  }
}