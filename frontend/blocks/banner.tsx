import Image from "next/image";
import { getMediaUrl } from "@/lib/cms/strapi";
import Link from "next/link";
import type { BlockBannerType } from "@/lib/cms/types/blocks";

export default function BannerBlock({
  title,
  description,
  buttonText,
  buttonHref,
  backgroundColor = "rgb(6, 96, 79)",
  backgroundImage,
  alignment = "center",
}: BlockBannerType) {
  const imageUrl = backgroundImage?.[0]?.url
    ? getMediaUrl(backgroundImage[0].url)
    : null;

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[alignment];

  return (
    <section className="relative py-32 overflow-hidden" style={{ backgroundColor }}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent -z-10" />
      
      {imageUrl && (
        <div className="absolute inset-0 opacity-25 -z-20">
          <Image
            src={imageUrl}
            alt="Banner background"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${alignmentClass} space-y-6`}>
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
              {title}
            </h2>
            {description && (
              <p className="text-xl text-white/95 max-w-3xl drop-shadow-md leading-relaxed">
                {description}
              </p>
            )}
          </div>
          
          {buttonHref && (
            <div className="pt-4">
              <Link
                href={buttonHref}
                className="inline-block px-8 py-4 bg-white text-[rgb(6,96,79)] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {buttonText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
