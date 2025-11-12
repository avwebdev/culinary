"use client";

import Link from "next/link";
import Image from "next/image";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import { InfoIcon, ShoppingCartIcon, LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";

type NavItem = { label: string; href: string };

interface NavbarClientProps {
  navItems: NavItem[];
  logoUrl: string | null;
  session: Session | null;
}

export default function NavbarClient({
  navItems,
  logoUrl,
  session,
}: NavbarClientProps) {
  return (
    <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center space-x-3"
            aria-label="Home"
          >
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="PUSD Culinary"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            )}
            <span className="font-semibold text-lg text-gray-900 hidden sm:inline">
              Culinary Department
            </span>
          </Link>

          <nav
            className="hidden md:flex items-center space-x-8"
            aria-label="Primary"
          >
            <div className="flex space-x-8">
              {navItems.map((item, i) => (
                <Link
                  key={`${item.href}-${i}`}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="cursor-pointer border-2 border-neutral-300">
                      <AvatarImage
                        referrerPolicy="no-referrer"
                        src={session.user?.image || undefined}
                        alt={session.user?.name || undefined}
                      />
                      <AvatarFallback>KV</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/user/info">
                        <InfoIcon className="text-inherit" /> Account Info
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/user/cart">
                        <ShoppingCartIcon className="text-inherit" /> Cart
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => redirect("/auth/signout")}>
                      <LogOutIcon className="text-inherit" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button type="button" onClick={() => signIn()}>
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
