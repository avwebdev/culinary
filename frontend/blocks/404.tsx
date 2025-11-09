import type { Block404Type } from "@/lib/cms/types/blocks";

export default function NotFoundBlock({ title, message }: Block404Type) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">{title || "404 - Not Found"}</h1>
      <p className="text-lg text-gray-600">{message || "The page you are looking for does not exist."}</p>
    </div>
  );
}
