import NavbarClient from "./Navbar.client";
import { getNavbarData } from "@/lib/cms/global";
import { getMediaUrl } from "@/lib/cms/strapi-client";
import { auth } from "@/lib/auth/auth";

export async function Navbar() {
  const navData = await getNavbarData();
  const navItems = navData.navItems;
  const logoUrl = navData.logo ? getMediaUrl(navData.logo.url) : null;

  const session = await auth();

  return (
    <NavbarClient
      navItems={navItems}
      logoUrl={logoUrl}
      session={session}
    />
  );
}
