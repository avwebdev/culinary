import Image from "next/image";
import hero from "@/public/home/hero.png";

export function Hero() {
  return (
    <div className="relative aspect-[20/7] min-h-screen w-full flex items-center justify-center">
      <div className="font-[family-name:var(--font-racing-sans-one)] flex items-center gap-4">
        <p className="translate-x-5 max-[700px]:text-[9rem] max-[500px]:translate-x-4 max-[800px]:-translate-y-6 max-[800px]:translate-x-8 max-[1000px]:-translate-y-3 max-[1300px]:text-[10rem] text-[11rem] text-saffron-mango-300 shadow-inner">6</p>{" "}
        <p className="translate-x-5 max-[700px]:text-[4rem] max-[500px]:translate-x-4 max-[800px]:-translate-y-11 max-[800px]:translate-x-8 max-[1000px]:-translate-y-8 max-[1300px]:text-[5rem] text-[6rem] text-ivory-50 -translate-y-5 shadow-inner">
          speed
        </p>
      </div>
      <Image
        src={hero}
        alt="Six Speed Photography Hero"
        className="absolute inset-0 -z-10 w-full min-h-screen max-h-screen object-cover"
      />
    </div>
  );
}
