import Image from "next/image";
import { getMediaUrl } from "@/lib/cms/strapi";
import Link from "next/link";
import type { BlockBannerType } from "@/lib/cms/types/blocks";

export default function BannerBlock({
  title,
  description,
  buttonText,
  buttonHref,
  backgroundColor = "bg-green-600",
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
    <section className={`relative py-20 ${backgroundColor} overflow-hidden`}>
      {imageUrl && (
        <div className="absolute inset-0 opacity-20 -z-10">
          <Image
            src={imageUrl}
            alt="Banner background"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={alignmentClass}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {buttonHref && (
            <Link
              href={buttonHref}
              className="inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
