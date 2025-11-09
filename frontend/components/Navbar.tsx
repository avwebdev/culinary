// import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getNavbarData } from "@/lib/cms/global";
import { getMediaUrl } from "@/lib/cms/strapi";

export async function Navbar() {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navData = await getNavbarData();

  console.log(navData);

  const navItems = navData.navItems;
  const logoUrl = getMediaUrl(navData.logo.url);

  console.log(logoUrl);

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <div className="shrink-0 font-sans">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bubblegum text-neutral-900 hidden sm:block">
                PUSD Culinary
              </h2>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 text-base">
            {navItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-neutral-700 hover:text-primary px-3 py-2 rounded-md font-medium flex items-center space-x-2"
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
          </div>
        </div>
      </div>
    </header>
  );
}