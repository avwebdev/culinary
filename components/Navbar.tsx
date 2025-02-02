"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  // State to toggle the mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogoClick = () => {
    if (window.matchMedia("(max-width: 700px)").matches) {
      setMenuOpen((prev) => !prev);
    }
  };


  return (
    <div className="absolute top-0 w-full z-10">
      <nav className={`flex w-full justify-center min-[700px]:justify-between items-center px-20 pt-1 ${menuOpen ? "max-[700px]:bg-black" : ""} `}>
        <Link
          className="uppercase drop-shadow-xl text-2xl max-[700px]:hidden"
          href="/"
        >
          home
        </Link>
        <Link
          className="uppercase drop-shadow-xl text-2xl max-[700px]:hidden"
          href="/#about"
        >
          about
        </Link>
        <div className="cursor-pointer" onClick={handleLogoClick}>
        <Link
          href="/"
        >
          <Image
            src="/logo.png"
            className="justify-center"
            alt="Six Speed Photography logo"
            width={150}
            height={150}
          />
        </Link>
        </div>

        <Link
          className="uppercase drop-shadow-xl text-2xl max-[700px]:hidden"
          href="/#gallery"
        >
          gallery
        </Link>
        <Link
          className="uppercase drop-shadow-xl text-2xl max-[700px]:hidden"
          href="/contact#contact"
        >
          contact
        </Link>
      </nav>

      {menuOpen && (
        <div className="-translate-y-1 absolute top-full left-0 w-full rounded-b-lg bg-black shadow-md flex flex-col items-center max-[700px]:visible text-[#fdbd57]">
          <Link
            onClick={() => setMenuOpen(false)}
            className="uppercase drop-shadow-xl text-2xl py-2"
            href="/"
          >
            home
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            className="uppercase drop-shadow-xl text-2xl py-2"
            href="/#about"
          >
            about
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            className="uppercase drop-shadow-xl text-2xl py-2"
            href="/#gallery"
          >
            gallery
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            className="uppercase drop-shadow-xl text-2xl py-2"
            href="/contact#contact"
          >
            contact
          </Link>
        </div>
      )}
    </div>
  );
}
