import Image from "next/image";
import { getMediaUrl } from "@/lib/cms/strapi";
import type { BlockStepsType } from "@/lib/cms/types/blocks";

export default function StepsBlock({
  title,
  subtitle,
  steps,
}: BlockStepsType) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps?.map((step, index) => {
            const imageUrl = step.image?.[0]?.url
              ? getMediaUrl(step.image[0].url)
              : null;

            return (
              <div key={index} className="flex flex-col">
                {/* Step number circle */}
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[rgb(6,96,79)] text-white flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block flex-grow ml-4 h-0.5 bg-gray-300"></div>
                  )}
                </div>

                {/* Step content */}
                {imageUrl && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {step.icon && (
                  <div className="text-4xl mb-3">{step.icon}</div>
                )}

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
