import { getMenuItemsFromSchool } from "@/lib/cms/repositories/menu-items";
import MenuGrid from "./MenuGrid";

export default async function SchoolPage({
  params,
}: {
  params: { school: string[] };
}) {
  const school = (await params).school.join("/").replaceAll("-", " ");
  const menuItems = await getMenuItemsFromSchool(school);

  if (!menuItems) {
    return (
      <div className="mx-auto p-6 md:p-10">
        <p className="text-center text-muted-foreground">
          Failed to load menu items for {school}.
        </p>
      </div>
    );
  }

  return <MenuGrid school={school} items={menuItems} />;
}
