import { getSchoolData } from "@/lib/cms/schools";
import SchoolPicker from "./school-picker";

// --- helpers to make a URL-friendly slug from each school ---
function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function slugFromUrl(url?: string) {
  if (!url) return undefined;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || slugify(u.hostname.replace(/^www\./, ""));
  } catch {
    // fallback if it's not a valid absolute URL
    return slugify(url);
  }
}

export default async function MenuPage() {
  const schools = await getSchoolData();

  return (
    <div className="mx-auto p-6 md:p-10">
      <SchoolPicker schools={schools} />
    </div>
  );
}
