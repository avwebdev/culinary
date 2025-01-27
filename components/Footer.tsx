import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#323232] text-white py-8">
      <div className="main-foot max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start justify-between">
        <div className="w-full md:w-1/3 mb-6 md:mb-0 flex items-center justify-center md:justify-start">
          <Image
            src="/logo.png"
            alt="Six Speed Photography logo"
            className="ml-5"
            width={125}
            height={125}
          />
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-1/3 flex flex-col mb-6 md:mb-0 items-center md:items-start">
          <div className="mx-auto">
            <h1 className="mb-4 text-lg">Quick Links</h1>
            <div className="grid grid-cols-2 text-sm gap-x-20 gap-y-4">
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
        </div>

        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
          <div className="mx-auto">
            <h1 className="mb-4">Socials</h1>
            <a
              href="https://instagram.com/6speedphoto/"
              target="_blank"
              rel="noreferrer"
              className="text-3xl hover:text-gray-400"
            >
              <Instagram />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto px-12">
        <hr className="my-6 border-gray-500 border-t-2" />
      </div>

      {/* Footer note */}
      <div className="text-center text-sm">made by aarush</div>
    </footer>
  );
}
