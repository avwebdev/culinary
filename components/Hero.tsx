import Image from "next/image";
import hero from "@/public/home/hero.png";

export function Hero() {
  return (
    <div className="relative aspect-[9/5] max-h-screen w-full flex items-center justify-center">
      <div className="font-[family-name:var(--font-racing-sans-one)] flex items-center gap-4">
        <p className="text-[11rem] text-saffron-mango-300 shadow-inner">6</p>{" "}
        <p className="text-[6rem] text-ivory-50 -translate-y-5 shadow-inner">
          speed
        </p>
      </div>
      <Image
        src={hero}
        alt="Six Speed Photography Hero"
        className="absolute inset-0 -z-10 w-full max-h-screen object-cover"
      />
    </div>
  );
}
