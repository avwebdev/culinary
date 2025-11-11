import Image from "next/image";
import { getMediaUrl } from "@/lib/cms/strapi";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: { url: string };
  difficulty?: string;
  time?: string;
}

interface FeaturedRecipesBlockType {
  __component: string;
  title?: string;
  subtitle?: string;
  recipes: Recipe[];
}

export default function FeaturedRecipesBlock({
  title,
  subtitle,
  recipes,
}: FeaturedRecipesBlockType) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border border-gray-200 overflow-hidden hover:border-gray-400 transition-colors"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={getMediaUrl(recipe.image.url)}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {recipe.description}
                </p>
                <div className="flex gap-4 text-xs text-gray-500">
                  {recipe.time && <span>Time: {recipe.time}</span>}
                  {recipe.difficulty && (
                    <span>Difficulty: {recipe.difficulty}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
