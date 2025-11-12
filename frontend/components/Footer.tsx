import Link from "next/link";
import { getFooterData } from "@/lib/cms/global";

export async function Footer() {
  const footerData = await getFooterData();

  if (!footerData) {
    return null;
  }

  return (
    <footer className="border-t border-gray-200 text-gray-300" style={{ backgroundColor: "rgb(6, 96, 79)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            {footerData.companyName && (
              <h3 className="text-white font-semibold text-lg mb-4">
                {footerData.companyName}
              </h3>
            )}
            {footerData.description && (
              <p className="text-sm text-gray-400">{footerData.description}</p>
            )}
          </div>

          {/* Footer Columns */}
          {footerData.columns?.map((column, idx) => (
            <div key={idx}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {column.title}
              </h4>
              {Array.isArray(column.links) && column.links.length > 0 ? (
              <ul className="space-y-2">
              {column.links.map((link, linkIdx) => (
              <li key={linkIdx}>
              <Link
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
              >
              {link.label}
              </Link>
              </li>
              ))}
              </ul>
              ) : column.content ? (
              <p className="text-sm text-gray-400">{column.content}</p>
              ) : null}
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex items-center justify-between">
          <div>
            {footerData.copyright && (
              <p className="text-sm text-gray-500">{footerData.copyright}</p>
            )}
          </div>
          
          {footerData.socialLinks && footerData.socialLinks.length > 0 && (
            <div className="flex gap-6">
              {footerData.socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  aria-label={social.platform}
                >
                  {social.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
