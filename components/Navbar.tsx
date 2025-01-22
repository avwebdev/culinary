import Image from "next/image";

export function Navbar() {

  return (
    <div className="absolute top-0 w-full z-10">
      <nav className="flex w-full justify-between items-center px-20 pt-1">
        <a className="uppercase drop-shadow-xl text-2xl">home</a>
        <a className="uppercase drop-shadow-xl text-2xl">about</a>
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
        <a className="uppercase drop-shadow-xl text-2xl">gallery</a>
        <a className="uppercase drop-shadow-xl text-2xl">contact</a>
      </nav>
    </div>
  );
}
