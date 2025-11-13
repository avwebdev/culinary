import Link from "next/link";

interface CTABlockType {
  __component: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundColor?: string;
}

export default function CTABlock({
  title,
  description,
  primaryButtonText,
  primaryButtonLink = "#",
  secondaryButtonText,
  secondaryButtonLink = "#",
  backgroundColor = "bg-gray-900",
}: CTABlockType) {
  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${backgroundColor}`}>
      <div className="max-w-4xl mx-auto text-center">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryButtonText && (
            <Link
              href={primaryButtonLink}
              className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
            >
              {primaryButtonText}
            </Link>
          )}
          {secondaryButtonText && (
            <Link
              href={secondaryButtonLink}
              className="inline-block px-8 py-3 border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
