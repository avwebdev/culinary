import { getMenuData } from "@/lib/cms/menu-items";
import MenuGrid from "./MenuGrid";

export default async function SchoolPage({
  params,
}: {
  params: { school: string[] };
}) {
  const school = (await params).school.join("/").replaceAll("-", " ");
  const menuItems = (await getMenuData(school)) as any[];

  return <MenuGrid school={school} items={menuItems} />;
}
