import Link from "next/link";
import Image from "next/image";

import { getNavbarData } from "@/lib/cms/global";
import { getMediaUrl } from "@/lib/cms/strapi";

export async function Navbar() {
  const navData = await getNavbarData();
  const navItems = navData.navItems;
  const logoUrl = navData.logo ? getMediaUrl(navData.logo.url) : null;

  return (
    <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="PUSD Culinary"
                width={36}
                height={36}
                className="object-contain"
              />
            )}
            <span className="font-semibold text-lg text-gray-900 hidden sm:inline">
              Culinary Department
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}