import Image from "next/image";
import { getMediaUrl } from "@/lib/cms/strapi-client";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  image?: { url: string };
}

interface EventsBlockType {
  __component: string;
  title?: string;
  subtitle?: string;
  events: Event[];
}

export default function EventsBlock({
  title,
  subtitle,
  events,
}: EventsBlockType) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-b border-gray-200">
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

        <div className="space-y-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 bg-white overflow-hidden hover:border-gray-400 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {event.image && (
                  <div className="relative h-48 md:h-auto overflow-hidden bg-gray-200">
                    <Image
                      src={getMediaUrl(event.image.url)}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className={`p-6 ${event.image ? "md:col-span-2" : "md:col-span-3"}`}>
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                      {event.date && (
                        <span>
                          <strong>Date:</strong> {event.date}
                          {event.time && ` at ${event.time}`}
                        </span>
                      )}
                      {event.location && (
                        <span>
                          <strong>Location:</strong> {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
