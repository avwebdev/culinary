import type { BlockContactType } from "@/lib/cms/types/blocks";

export default function ContactBlock({
  title,
  subtitle,
  schools,
}: BlockContactType) {
  const schoolList = Array.isArray(schools) ? schools : [];

  return (
    <section className="py-16 bg-gray-50">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schoolList.map((school, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {school.name}
              </h3>

              <div className="space-y-2 text-sm">
                {school.teacher && (
                  <p>
                    <span className="font-semibold text-gray-700">Teacher:</span>{" "}
                    {school.teacher}
                  </p>
                )}

                {school.email && (
                  <p>
                    <span className="font-semibold text-gray-700">Email:</span>{" "}
                    <a
                      href={`mailto:${school.email}`}
                      className="text-green-600 hover:text-green-700"
                    >
                      {school.email}
                    </a>
                  </p>
                )}

                {school.phone && (
                  <p>
                    <span className="font-semibold text-gray-700">Phone:</span>{" "}
                    <a
                      href={`tel:${school.phone}`}
                      className="text-green-600 hover:text-green-700"
                    >
                      {school.phone}
                    </a>
                  </p>
                )}

                {school.instagram && (
                  <p>
                    <span className="font-semibold text-gray-700">
                      Instagram:
                    </span>{" "}
                    <a
                      href={`https://instagram.com/${school.instagram.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                    >
                      @{school.instagram.replace("@", "")}
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
