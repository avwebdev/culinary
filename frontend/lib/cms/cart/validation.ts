import client from "../strapi";

export async function validateSlugs(slugs: string[]) {
  const uniq = Array.from(new Set(slugs));
  if (uniq.length === 0)
    return { valid: new Set<string>(), invalid: new Set<string>() };

  const res = await client.collection("menu-item").find({
    filters: { slug: { $in: uniq } }, // match any slug
    fields: ["slug"], // we only need slugs back
    pagination: { pageSize: 200 },
  });

  // The client returns a normalized structure; be tolerant to shape changes:
  const items = res.data; // Strapi client typically returns { data, meta }
  const got = new Set(
    items.map(doc => doc.slug ?? doc.attributes?.slug)
  );

  const valid = new Set<string>();
  const invalid = new Set<string>();
  for (const s of slugs) (got.has(s) ? valid : invalid).add(s);

  return { valid, invalid };
}
