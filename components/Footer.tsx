import Link from "next/link";
import { Utensils, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const quickLinks = [
    { name: "Amador Valley Menu", href: "/menu/amador-valley" },
    { name: "Foothill Menu", href: "/menu/foothill" },
    { name: "Village Menu", href: "/menu/village" },
    { name: "Custom Requests", href: "/custom-requests" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Accessibility", href: "/accessibility" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bubblegum text-slate-900">PUSD Culinary</span>
            </div>
            <p className="text-gray-600 text-sm max-w-sm">
              Providing fresh, nutritious, and student-crafted meals to the Pleasanton Unified School District community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-emerald-600 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-600" />
                <a href="mailto:culinary@pleasantonusd.net" className="text-gray-600 text-sm hover:text-emerald-600">
                  culinary@pleasantonusd.net
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-600" />
                <a href="tel:+19254264290" className="text-gray-600 text-sm hover:text-emerald-600">
                  (925) 426-4290
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-600 text-sm">
                  Pleasanton, CA
                </span>
              </div>
            </div>
          </div>
          
          {/* Service Hours */}
          <div className="md:col-span-3">
             <h3 className="font-semibold text-slate-900 mb-4">Service Hours</h3>
             <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-slate-800">Monday - Friday:</span> 7:00 AM - 3:00 PM</p>
                <p><span className="font-medium text-slate-800">Saturday:</span> 8:00 AM - 2:00 PM</p>
                <p><span className="font-medium text-slate-800">Sunday:</span> Closed</p>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Pleasanton Unified School District. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {legalLinks.map(link => (
              <Link key={link.name} href={link.href} className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}