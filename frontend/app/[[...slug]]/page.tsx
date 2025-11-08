import { BaseBlock } from "@/blocks/type";
import { getPageData } from "@/utils/cms/page";
import { redirect } from "next/navigation";

export default async function UniversalsPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slug = (await params).slug || [];
  const path = "/" + slug.join("/");

  console.log(path);

  const data = await getPageData(path);

  console.log(data);

  // no pages found with matching slug
  if (!data.length && path != "/404") {
    return redirect("/404");
  }

  const page = data[0];
  const blocks = page.blocks || [];

  console.log(page.blocks);

  const renderedBlocks = await Promise.all(
    blocks.map(async (block: BaseBlock, i: number) => {
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
