import Image from "next/image";

export function Navbar() {
  return (
    <div className="fixed top-0 w-full z-10">
      <nav className="flex w-full justify-between items-center px-20">
        <a className="uppercase drop-shadow-xl text-4xl" style={{ transform:"translateY(-50px)" }}>home</a>
        <a className="uppercase drop-shadow-xl text-4xl" style={{ transform:"translateY(-50px)" }}>about</a>
        <Image
          src="/logo.png"
          alt="Six Speed Photography logo"
          width={250}
          height={250}
        />
        <a className="uppercase drop-shadow-xl text-4xl" style={{ transform:"translateY(-50px)" }}>gallery</a>
        <a className="uppercase drop-shadow-xl text-4xl" style={{ transform:"translateY(-50px)" }}>contact</a>
      </nav>
    </div>
  );
}
