import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#323232] text-white py-8">
      <div className="main-foot max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 flex items-center space-x-2" style={{ gridArea: "logo" }}>
          <Image
            src="/logo.png"
            alt="Six Speed Photography logo"
            width={125}
            height={125}
          />
          {/* <div className="hidden sm:block leading-none">
            <p className="font-bold">SIX SPEED</p>
            <p className="text-sm">PHOTOGRAPHY</p>
          </div> */}
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h1 style={{ gridArea: "title-1" }}>Quick Links</h1>
          <div className="grid grid-cols-2 text-sm gap-8" style={{ gridArea: "left-2" }}>
            <Link href="/" legacyBehavior>
              <a className="hover:text-gray-400">Home</a>
            </Link>
            <Link href="/about" legacyBehavior>
              <a className="hover:text-gray-400">About</a>
            </Link>
            <Link href="/gallery" legacyBehavior>
              <a className="hover:text-gray-400">Gallery</a>
            </Link>
            <Link href="/contact" legacyBehavior>
              <a className="hover:text-gray-400">Contact</a>
            </Link>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 style={{ gridArea: "title-2" }}>Socials</h1>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-xl hover:text-gray-400"
            style={{ gridArea: "right-2" }}
          >
            <Instagram />
          </a>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-700" />

      {/* Footer note */}
      <div className="text-center text-sm">made by aarush</div>
    </footer>
  );
}
