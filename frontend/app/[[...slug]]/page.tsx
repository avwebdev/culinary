import { notFound } from "next/navigation";

import { getPageData } from "@/lib/cms/page";
import type { BaseBlockType } from "@/lib/cms/types/blocks";

export default async function CMSPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slug = (await params).slug || [];
  const path = "/" + slug.join("/");

  console.log("Looking for path:", path);

  const data = await getPageData(path);

  console.log("Found data:", data);

  // no pages found with matching slug
  if (!data || !data.length) {
    return notFound();
  }

  const page = data[0];
  const blocks = page?.blocks || [];

  console.log(page.blocks);

  const renderedBlocks = await Promise.all(
    blocks.map(async (block: BaseBlockType, i: number) => {
      if (block.__component && block.__component.startsWith("blocks.")) {
        const mod = await import(
          `@/blocks/${block.__component.replace("blocks.", "")}`
        );
        const Component = mod.default;
        return <Component key={i} {...block} />;
      }
      return null;
    })
  );

  return <div>{renderedBlocks}</div>;
}
