import StrapiButton from "@/cms_primitives/strapi_button";
import type { BlockHeroType } from "@/lib/cms/types/blocks";

export default function HeroBlock({
  size,
  title,
  subtitle,
  buttons,
  background,
}: BlockHeroType) {
  return (
    <div
      className={`relative flex items-center justify-center text-center ${
        size === "small" ? "h-64" : size === "medium" ? "h-96" : "h-[500px]"
      }`}
    >
      <div className="relative z-10 px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-7xl text-primary font-medium mb-4 whitespace-pre-line">{title}</h1>
        {subtitle && <p className="text-neutral-700 text-base md:text-lg lg:text-xl mb-6 whitespace-pre-line">{subtitle}</p>}
        <div className="space-x-4">
          {buttons.map((button, index) => (
            <StrapiButton key={index} {...button} />
          ))}
        </div>
      </div>
    </div>
  );
}
