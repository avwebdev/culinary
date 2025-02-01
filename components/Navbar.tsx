"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  // State to toggle the mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      setMenuOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (!window.matchMedia("(max-width: 640px)").matches && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  return (
    <div className="absolute top-0 w-full z-10">
      <nav className="flex w-full justify-center sm:justify-between items-center ~md/lg:~px-10/20 pt-1">
        <Link
          className="uppercase drop-shadow-xl ~md/lg:~text-xl/2xl hidden sm:block"
          href="/"
        >
          home
        </Link>
        <Link
          className="uppercase drop-shadow-xl ~md/lg:~text-xl/2xl hidden sm:block"
          href="/#about"
        >
          about
        </Link>
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <Image
            src="/logo.png"
            alt="Six Speed Photography logo"
            width={150}
            height={150}
            className="w-32"
          />
        </div>

        <Link
          className="uppercase drop-shadow-xl ~md/lg:~text-xl/2xl hidden sm:block"
          href="#"
        >
          gallery
        </Link>
        <Link
          className="uppercase drop-shadow-xl ~md/lg:~text-xl/2xl hidden sm:block"
          href="/contact"
        >
          contact
        </Link>
      </nav>

      {menuOpen && (
        <div className="absolute top-full left-0 w-[94%] mx-[3%] rounded-lg bg-neutral-200 shadow-md flex flex-col items-center sm:hidden text-black">
          <Link
            onClick={() => setMenuOpen(false)}
            className="uppercase drop-shadow-xl ~md/lg:~text-xl/2xl py-2"
            href="/"
          >
            home
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            className="uppercase drop-shadow-xl ~md/lg:~text-xl/2xl py-2"
            href="/#about"
          >
            about
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            className="uppercase drop-shadow-xl ~md/lg:~text-xl/2xl py-2"
            href="#"
          >
            gallery
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            className="uppercase drop-shadow-xl ~md/lg:~text-xl/2xl py-2"
            href="/contact"
          >
            contact
          </Link>
        </div>
      )}
    </div>
  );
}
