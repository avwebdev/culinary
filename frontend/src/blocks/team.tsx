import Image from "next/image";
import { getMediaUrl } from "@/lib/cms/strapi-client";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio?: string;
  image?: { url: string };
}

interface TeamBlockType {
  __component: string;
  title?: string;
  subtitle?: string;
  members: TeamMember[];
}

export default function TeamBlock({
  title,
  subtitle,
  members,
}: TeamBlockType) {
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
          {members.map((member) => (
            <div key={member.id} className="text-center">
              {member.image && (
                <div className="relative h-64 w-full overflow-hidden mb-4 border border-gray-200">
                  <Image
                    src={getMediaUrl(member.image.url)}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-primary font-medium mb-3">{member.title}</p>
              {member.bio && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
