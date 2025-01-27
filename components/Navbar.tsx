import Image from "next/image";
import Link from "next/link";

export function Navbar() {

  return (
    <div className="absolute top-0 w-full z-10">
      <nav className="flex w-full justify-between items-center px-20 pt-1">
        <Link className="uppercase drop-shadow-xl text-2xl" href="/">home</Link>
        <Link className="uppercase drop-shadow-xl text-2xl" href="#">about</Link>
        <div
          className="transition-all duration-300 size-32"
        >
          <Image
            src="/logo.png"
            alt="Six Speed Photography logo"
            width={150}
            height={150}
          />
        </div>
        <Link className="uppercase drop-shadow-xl text-2xl" href="#">gallery</Link>
        <Link className="uppercase drop-shadow-xl text-2xl" href="/contact">contact</Link>
      </nav>
    </div>
  );
}
