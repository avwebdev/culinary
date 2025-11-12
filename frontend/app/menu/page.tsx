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
  const raw = await getSchoolData();

  // Expecting objects like { name, url, slug?, ... }
  const schools = (raw ?? [])
    .map((s: any) => ({
      name: String(s?.name ?? "").trim(),
      slug:
        (s?.slug && String(s.slug)) ||
        slugFromUrl(s?.url) ||
        (s?.name ? slugify(String(s.name)) : ""),
    }))
    .filter((s: { name: string; slug: string }) => s.name && s.slug)
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto p-6 md:p-10">
      <SchoolPicker schools={schools} />
    </div>
  );
}
