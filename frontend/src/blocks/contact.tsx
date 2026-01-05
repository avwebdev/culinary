import type { components } from "@/lib/cms/types";
import type { SchoolType } from "@/lib/cms/repositories/schools";
import OrderCalendar from "@/components/OrderCalendar";

// the schools field is defined as a one-to-many relationship
// type generation doesn't capture this relation correctly, so we override it here
type BlockContactType = Omit<components["schemas"]["BlocksContactComponent"], "schools"> & {
  schools: SchoolType[];
};

export default function ContactBlock({
  title,
  subtitle,
  schools,
}: BlockContactType) {
  const schoolList = Array.isArray(schools) ? schools : [];

  // Convert schools to the format expected by OrderCalendar
  const calendarSchools = schoolList.map((school) => ({
    id: String(school.id),
    name: school.name || "",
  }));

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

        {/* Order Calendar Section */}
        <div className="mb-16">
          <OrderCalendar
            schools={calendarSchools}
            title="Schedule a Custom Order"
            description="Select your school and preferred delivery date, then browse our menu to place your order."
          />
        </div>

        {/* School Contact Cards */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Our Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schoolList.map((school, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {school.name}
              </h3>

              <div className="space-y-3 text-sm">
                {school.teacher && (
                  <p>
                    <span className="font-semibold text-gray-700">Teacher:</span>{" "}
                    {school.teacher}
                  </p>
                )}

                {school.email && (
                  <p className="flex items-center gap-2">
                    <span className="text-lg">📧</span>
                    <a
                      href={`mailto:${school.email}`}
                      className="text-[rgb(6,96,79)] hover:text-[rgb(4,60,50)] break-all"
                    >
                      {school.email}
                    </a>
                  </p>
                )}

                {school.phone && (
                  <p className="flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    <a
                      href={`tel:${school.phone}`}
                      className="text-[rgb(6,96,79)] hover:text-[rgb(4,60,50)]"
                    >
                      {school.phone}
                    </a>
                  </p>
                )}

                {school.instagram && (
                  <p className="flex items-center gap-2">
                    <span className="text-lg">📱</span>
                    <a
                      href={`https://instagram.com/${school.instagram.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgb(6,96,79)] hover:text-[rgb(4,60,50)]"
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
      </div>
    </section>
  );
}
