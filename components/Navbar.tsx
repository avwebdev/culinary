'use client';
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-0 w-full z-10">
      <nav className="flex max-w-screen w-full justify-between items-center px-20 pt-1">
        {/* Links for large screens */}
        <div className="max-[700px]:hidden flex space-x-6">
          <Link className="uppercase drop-shadow-xl text-2xl" href="/">home</Link>
          <Link className="uppercase drop-shadow-xl text-2xl" href="/#about">about</Link>
          <Link className="uppercase drop-shadow-xl text-2xl" href="#">gallery</Link>
          <Link className="uppercase drop-shadow-xl text-2xl" href="/contact">contact</Link>
        </div>

        {/* Logo (always visible) */}
        <button className="relative" onClick={() => setIsOpen(!isOpen)}>
          <Image
            src="/logo.png"
            alt="Six Speed Photography logo"
            width={150}
            height={150}
          />
        </button>

        {/* Dropdown for small screens */}
        {isOpen && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-48 bg-gray-900 text-white shadow-lg rounded-md max-[700px]:block hidden">
            <Link className="block px-4 py-2 hover:bg-gray-700" href="/">Home</Link>
            <Link className="block px-4 py-2 hover:bg-gray-700" href="/#about">About</Link>
            <Link className="block px-4 py-2 hover:bg-gray-700" href="#">Gallery</Link>
            <Link className="block px-4 py-2 hover:bg-gray-700" href="/contact">Contact</Link>
          </div>
        )}
      </nav>
    </div>
  );
}
