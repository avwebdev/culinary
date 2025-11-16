import NavbarClient from "./Navbar.client";
import { auth } from "@/lib/auth/auth";
import { getMediaUrl } from "@/lib/cms/utils";
import { getHeader } from "@/lib/cms/repositories/global";

export async function Navbar() {
  const navData = await getHeader();

  if (!navData) {
    return null;
  }

  const navItems = navData.navItems;
  const logoUrl = navData.logo?.url ? getMediaUrl(navData.logo.url) : null;

  const session = await auth();

  return (
    <NavbarClient
      navItems={navItems}
      logoUrl={logoUrl}
      session={session}
    />
  );
}
