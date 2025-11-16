import { notFound } from "next/navigation";

import { getPageByPath } from "@/lib/cms/repositories/pages";
import type { components } from "@/lib/cms/types";

type BaseBlockType = components["schemas"][keyof {
  [K in keyof components["schemas"] as K extends `Blocks${string}Component`
    ? K
    : never]: components["schemas"][K];
}];

export type CMSPageProps = {
  params: { slug?: string[] };
};

export default async function CMSPage({ params }: CMSPageProps) {
  const slug = (await params).slug || [];
  const path = "/" + slug.join("/");

  const page = await getPageByPath(path);

  // no pages found with matching slug
  if (!page) {
    return notFound();
  }

  const blocks = page.blocks || [];

  const renderedBlocks = await Promise.all(
    blocks.map(async (block: BaseBlockType, i) => {
      if (block.__component && block.__component.startsWith("blocks.")) {
        let mod;
        try {
          mod = await import(
            `@/blocks/${block.__component.replace("blocks.", "")}`
          );
        } catch (e) {
          console.error(
            `Failed to load block component for ${block.__component}:`,
            e
          );
          return null;
        }

        const Component = mod.default;
        return <Component key={i} {...block} />;
      }
      return null;
    })
  );

  return <div>{renderedBlocks}</div>;
}
