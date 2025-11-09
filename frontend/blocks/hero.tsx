import { getMediaUrl } from "@/lib/cms/strapi";
import type { BlockHeroType } from "@/lib/cms/types/blocks";
import StrapiButton from "@/cms_primitives/strapi_button";
import Image from "next/image";

export default function HeroBlock({
  size,
  title,
  subtitle,
  buttons,
  background,
}: BlockHeroType) {
  const mediaUrl = getMediaUrl(background[0].url);

  return (
    <div
      className={`relative flex items-center justify-center text-center ${
        size === "small" ? "h-96" : "h-[500px]"
      }`}
    >
      <div className="-z-30 absolute size-full overflow-hidden">
        <Image
          src={mediaUrl}
          alt="Hero Background"
          fill
          className="object-cover object-center blur-[3px]"
        />
      </div>
      <div className="absolute size-full -z-10 bg-linear-to-b from-white/60 from-80% via-white/60 to-white"></div>
      <div className="relative z-10 px-8 max-w-4xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl text-primary font-medium mb-4 whitespace-pre-line">
          {title}
        </h1>
        {subtitle && (
          <p className="text-neutral-800 text-base md:text-lg lg:text-xl mb-6 whitespace-pre-line">
            {subtitle}
          </p>
        )}
        <div className="space-x-4">
          {buttons.map((button, index) => (
            <StrapiButton key={index} {...button} />
          ))}
        </div>
      </div>
    </div>
  );
}
