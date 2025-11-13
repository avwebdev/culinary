import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { serverStrapi } from "@/lib/cms/strapi-server";
import { validateSlugs } from "@/lib/cms/cart/validation";

type CartLine = string[];

async function fetchOrCreateUserCart(userEmail: string) {
  const client = serverStrapi();
  const carts = client.collection("carts");

  const found = await carts.find({
    filters: { userEmail },
    populate: "*",
  });

  const data = found.data;
  if (data?.[0]) return data[0];

  const created = await carts.create({ userEmail, lines: [] });
  return created.data;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await fetchOrCreateUserCart(session.user.email);
  return NextResponse.json({ id: cart.documentId, lines: cart.lines });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userEmail = session.user.email;

  const payload = (await req.json().catch(() => null)) as {
    op: "add" | "remove" | "set";
    slugs: string[];
  } | null;
  if (!payload || !Array.isArray(payload.slugs)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const client = serverStrapi();
  const carts = client.collection("carts");

  const cart = await fetchOrCreateUserCart(userEmail);
  const current = cart.lines;

  const { valid, invalid } = await validateSlugs(payload.slugs);

  let nextLines: {uuid: string}[] = current;
  if (payload.op === "set") {
    nextLines = [...valid].map((s) => ({ uuid: s }));
  } else if (payload.op === "add") {
    nextLines = current.concat(
      payload.slugs
        .filter((s) => valid.has(s))
        .map((s) => ({ uuid: s }))
    );
  } else if (payload.op === "remove") {
    const toRemove = new Map<string, number>();
    for (const s of payload.slugs) toRemove.set(s, (toRemove.get(s) ?? 0) + 1);

    nextLines = [];
    for (const line of current) {
      const left = toRemove.get(line) ?? 0;
      if (left > 0) toRemove.set(line, left - 1);
      else nextLines.push(line);
    }
  }

  const updated = await carts.update(cart.documentId, { lines: nextLines });
  const updatedDoc = updated.data;

  return NextResponse.json({
    id: updatedDoc.documentId,
    lines: updatedDoc.lines,
    removedInvalid: Array.from(invalid),
  });
}
