import { NextResponse } from "next/server";
import { serverStrapi } from "@/lib/cms/strapi-server";
import { validateSlugs } from "@/lib/cms/cart/validation";
import { auth } from "@/lib/auth/auth";

type CartLine = { menuSlug: string; addedAt?: string };

function getId(doc: any) {
  return doc?.documentId ?? doc?.id;
}
function getLines(doc: any): CartLine[] {
  return doc?.lines ?? doc?.attributes?.lines ?? [];
}

async function fetchOrCreateUserCart(userEmail: string, carts: any) {
  const found = await carts.find({
    filters: { user: { userEmail } },
    populate: ["lines"],
    pagination: { pageSize: 1 },
  });
  const data = (found as any).data ?? found;
  if (data?.[0]) return data[0];
  const created = await carts.create({ userEmail, lines: [] });
  return (created as any).data ?? created;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { localSlugs = [] } = (await req.json().catch(() => ({}))) as {
    localSlugs?: string[];
  };
  const client = serverStrapi();
  const carts = client.collection("carts");

  const cart = await fetchOrCreateUserCart(session.user.email, carts);
  const currentSlugs = getLines(cart).map((l) => l.menuSlug);

  const mergedSlugs = currentSlugs.concat(localSlugs);
  const { valid, invalid } = await validateSlugs(mergedSlugs);

  const now = new Date().toISOString();
  // Preserve multiplicity (each occurrence == one line)
  const counts = new Map<string, number>();
  for (const s of mergedSlugs) counts.set(s, (counts.get(s) ?? 0) + 1);
  const nextLines: CartLine[] = [];
  for (const s of valid) {
    for (let i = 0; i < (counts.get(s) ?? 0); i++) {
      nextLines.push({ menuSlug: s, addedAt: now });
    }
  }

  const updated = await carts.update(getId(cart), { lines: nextLines });
  const updatedDoc = (updated as any).data ?? updated;

  return NextResponse.json({
    id: getId(updatedDoc),
    lines: getLines(updatedDoc),
    removedFromMerge: Array.from(invalid),
  });
}
