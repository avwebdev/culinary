import type { BlockCardType } from "@/lib/cms/types/blocks";
import Image from "next/image";
import { getMediaUrl } from "@/lib/cms/strapi";
import Link from "next/link";

export default function CardBlock({
  title,
  description,
  icon,
  image,
  link,
  variant = "third",
}: BlockCardType) {
  const containerClass =
    variant === "full"
      ? "w-full"
      : "w-full md:w-1/3 md:inline-block md:pr-4";

  const imageUrl = image?.[0]?.url ? getMediaUrl(image[0].url) : null;

  return (
    <div className={containerClass}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        {imageUrl && (
          <div className="relative w-full h-48">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
          {icon && <div className="text-4xl mb-3">{icon}</div>}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          {description && <p className="text-gray-600 mb-4 flex-grow">{description}</p>}
          {link?.href && (
            <Link
              href={link.href}
              className="text-green-600 hover:text-green-800 font-medium inline-flex items-center gap-1 mt-auto"
            >
              {link.label} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
