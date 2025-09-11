import Link from "next/link";
import { Utensils, Mail, Phone, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">PUSD Culinary Department</span>
            </div>
            <p className="text-gray-200 text-sm mb-4">
              Providing fresh, nutritious meals to Pleasanton Unified School District students and staff.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-200 hover:text-emerald-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-200 hover:text-emerald-400 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-200 hover:text-emerald-400 transition-colors">
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-gray-200 hover:text-emerald-400 transition-colors text-sm">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="text-gray-200 hover:text-emerald-400 transition-colors text-sm">
                  Reservations
                </Link>
              </li>
              <li>
                <Link href="/custom-requests" className="text-gray-200 hover:text-emerald-400 transition-colors text-sm">
                  Custom Requests
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-200 hover:text-emerald-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-200 text-sm">
                  culinary@pleasantonusd.net
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-200 text-sm">
                  (925) 426-4290
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-200 text-sm">
                  Pleasanton, CA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Hours */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h3 className="font-semibold mb-4">Service Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Weekdays</h4>
              <span className="text-gray-200 text-sm">Monday - Friday</span>
              <span className="text-gray-200 text-sm">7:00 AM - 3:00 PM</span>
            </div>
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Saturday</h4>
              <span className="text-gray-200 text-sm">Saturday</span>
              <span className="text-gray-200 text-sm">8:00 AM - 2:00 PM</span>
            </div>
            <div>
              <h4 className="font-medium text-emerald-400 mb-2">Sunday</h4>
              <span className="text-gray-200 text-sm">Sunday</span>
              <span className="text-gray-200 text-sm">Closed</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-200 text-sm">
              © 2024 Pleasanton Unified School District. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <div className="text-gray-200 text-sm">
                <Link href="/privacy" className="text-gray-200 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </div>
              <div className="text-gray-200 text-sm">
                <Link href="/terms" className="text-gray-200 hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </div>
              <div className="text-gray-200 text-sm">
                <Link href="/accessibility" className="text-gray-200 hover:text-emerald-400 transition-colors">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
