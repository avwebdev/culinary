interface Feature {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
}

interface FeaturesBlockType {
  __component: string;
  title?: string;
  subtitle?: string;
  features: Feature[];
}

export default function FeaturesBlock({
  title,
  subtitle,
  features,
}: FeaturesBlockType) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features?.map((feature) => (
            <div
              key={feature.id}
              className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
            >
              {feature.icon && (
                <div className="text-5xl mb-4">{feature.icon}</div>
              )}
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              {feature.subtitle && (
                <p className="text-gray-600 text-base leading-relaxed">
                  {feature.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
