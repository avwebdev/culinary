import Image from "next/image";
import { getMediaUrl } from "@/lib/cms/strapi";

interface AboutBlockType {
  __component: string;
  title?: string;
  content?: string;
  image?: { url: string };
  imagePosition?: "left" | "right";
}

export default function AboutBlock({
  title,
  content,
  image,
  imagePosition = "right",
}: AboutBlockType) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
          {imagePosition === "left" && image && (
            <div className="relative h-96 w-full overflow-hidden border border-gray-200">
              <Image
                src={getMediaUrl(image.url)}
                alt={title || "About"}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div>
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {title}
              </h2>
            )}
            {content && (
              <div className="text-gray-600 text-lg leading-relaxed space-y-4 whitespace-pre-line">
                {content}
              </div>
            )}
          </div>

          {imagePosition === "right" && image && (
            <div className="relative h-96 w-full overflow-hidden border border-gray-200">
              <Image
                src={getMediaUrl(image.url)}
                alt={title || "About"}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
