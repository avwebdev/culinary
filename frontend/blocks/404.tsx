import Link from "next/link";
import type { Block404Type } from "@/lib/cms/types/blocks";

export default function NotFoundBlock({ title, message }: Block404Type) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl font-bold text-gray-900 mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title || "Page Not Found"}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {message || "The page you are looking for does not exist."}
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
