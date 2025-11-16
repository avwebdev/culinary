import Image from "next/image";
import { getMediaUrl } from "@/lib/cms/utils";
import { components } from "@/lib/cms/types";

type BlockCardType = components["schemas"]["BlocksCardComponent"];

export default function CardBlock({
  title,
  description,
  image,
}: BlockCardType) {
  const imageUrl = image?.[0]?.url ? getMediaUrl(image[0].url) : null;

  return (
    <div className="w-full md:w-1/3 md:inline-block md:pr-4">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        {imageUrl && (
          <div className="relative w-full h-48">
            <Image
              src={imageUrl}
              alt={title || ""}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6 flex flex-col grow">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          {description && <p className="text-gray-600 mb-4 grow">{description}</p>}
        </div>
      </div>
    </div>
  );
}
