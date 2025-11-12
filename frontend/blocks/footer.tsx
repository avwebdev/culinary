import Link from "next/link";
import { getFooterData } from "@/lib/cms/global";
import type { FooterType } from "@/lib/cms/types/page";

export async function GlobalFooter() {
  const footerData = await getFooterData();

  if (!footerData) {
    return null;
  }

  return <FooterBlock {...footerData} />;
}

function FooterBlock({
  companyName,
  description,
  columns,
  copyright,
  socialLinks,
}: FooterType) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            {companyName && (
              <h3 className="text-white font-semibold text-lg mb-4">
                {companyName}
              </h3>
            )}
            {description && <p className="text-sm text-gray-400">{description}</p>}
          </div>

          {/* Footer Links */}
          {columns?.map((column, idx) => (
            <div key={idx}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links?.map((link, linkIdx) => (
                  link?.href && (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 pt-8">
          {socialLinks && socialLinks.length > 0 && (
            <div className="mb-4 flex gap-4">
              {socialLinks.map((social, idx) => (
                social?.url && (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.platform}
                  >
                    {social.platform}
                  </a>
                )
              ))}
            </div>
          )}
          {copyright && (
            <p className="text-sm text-gray-500">{copyright}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
