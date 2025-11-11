interface Program {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface ProgramsBlockType {
  __component: string;
  title?: string;
  subtitle?: string;
  programs: Program[];
}

export default function ProgramsBlock({
  title,
  subtitle,
  programs,
}: ProgramsBlockType) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white p-8 border border-gray-200 hover:border-gray-400 transition-colors"
            >
              {program.icon && (
                <div className="text-4xl mb-4">{program.icon}</div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {program.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {program.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
