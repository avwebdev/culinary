interface TextContentBlockType {
  __component: string;
  title?: string;
  content?: string;
  columns?: 1 | 2;
  backgroundColor?: "white" | "gray";
}

export default function TextContentBlock({
  title,
  content,
  columns = 1,
  backgroundColor = "white",
}: TextContentBlockType) {
  const bgClass = backgroundColor === "gray" ? "bg-gray-50" : "bg-white";
  const borderClass = backgroundColor === "gray" ? "border-gray-200" : "";

  return (
    <section
      className={`py-16 px-4 sm:px-6 lg:px-8 ${bgClass} ${
        backgroundColor === "gray" ? "border-t border-b border-gray-200" : ""
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {title}
          </h2>
        )}
        {content && (
          <div
            className={`grid gap-8 ${
              columns === 2 ? "md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
              {content}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
