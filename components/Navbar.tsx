"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { 
  Utensils, 
  Calendar, 
  User, 
  LogOut, 
  Settings,
  ShoppingCart,
  Menu as MenuIcon
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Menu", href: "/menu", icon: Utensils },
    { name: "Reservations", href: "/reservations", icon: Calendar },
    { name: "Custom Requests", href: "/custom-requests", icon: Settings },
    { name: "Contact", href: "/contact", icon: User },
  ];

  const adminNavigation = [
    { name: "Dashboard", href: "/admin", icon: Settings },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Menu Management", href: "/admin/menu", icon: Utensils },
    { name: "Reservations", href: "/admin/reservations", icon: Calendar },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">PUSD Culinary</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User menu and authentication */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* Shopping cart icon */}
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </Button>
                </Link>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback>
                          {session.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Admin navigation for admin users */}
                    {session.user?.role === "admin" && (
                      <>
                        {adminNavigation.map((item) => (
                          <DropdownMenuItem key={item.name} asChild>
                            <Link href={item.href} className="flex items-center space-x-2">
                              <item.icon className="h-4 w-4" />
                              <span>{item.name}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => signOut()}
                      className="flex items-center space-x-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {session?.user?.role === "admin" && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
