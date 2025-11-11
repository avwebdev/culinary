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
        size === "small" ? "h-80" : "h-screen"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden -z-20">
        <Image
          src={mediaUrl}
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/40"></div>
      <div className="relative z-10 px-8 max-w-4xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 whitespace-pre-line text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg lg:text-xl mb-8 whitespace-pre-line text-gray-100">
            {subtitle}
          </p>
        )}
        {buttons && buttons.length > 0 && (
          <div className="flex gap-4 justify-center">
            {buttons.map((button, index) => (
              <StrapiButton key={index} {...button} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
