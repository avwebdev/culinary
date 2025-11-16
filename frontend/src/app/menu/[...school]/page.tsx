import { getMenuItems } from "@/lib/cms/repositories/menu-items";
import MenuGrid from "./MenuGrid";

export default async function SchoolPage({
  params,
}: {
  params: { school: string[] };
}) {
  const school = (await params).school.join("/").replaceAll("-", " ");
  const menuItems = await getMenuItems();

  return <MenuGrid school={school} items={menuItems} />;
}
