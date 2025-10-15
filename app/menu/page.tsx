import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ArrowRight } from "lucide-react";
import Image from "next/image";

const schools = [
  {
    name: "Amador Valley High School",
    slug: "amador-valley",
    image: "/schools/amador-valley.png",
  },
  {
    name: "Foothill High School",
    slug: "foothill",
    image: "/schools/foothill.png",
  },
  {
    name: "Village High School",
    slug: "village",
    image: "/schools/village.png",
  },
];

export default function MenuSelectionPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-ptSerif text-slate-900">
            Choose Your School
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Select your school to view the daily menu, place an order, or make a
            reservation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school) => (
            <Link
              key={school.slug}
              href={`/menu/${school.slug}`}
              className="group"
            >
              <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="relative h-56 w-full">
                  <Image
                    src={school.image}
                    alt={`${school.name} food`}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-ptSerif text-slate-900 group-hover:text-[--accent] transition-colors">
                    {school.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-end justify-between">
                  <div className="flex items-center text-primary font-semibold">
                    <span>View Menu</span>
                    <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                  <Utensils className="h-8 w-8 text-gray-300 group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* General policies for all schools */}
        <div className="mt-12 max-w-3xl mx-auto bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-ptSerif text-slate-900 mb-4">General Policies</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>No deliveries will be made (VHS delivers)</li>
            <li>Order pickup is between 8-2:30 on school days (VHS 9-2)</li>
            <li>Orders need to be made at least 1 week before fulfillment date</li>
            <li>Payment should be received 1 week after receipt of invoice</li>
            <li>Certain items will have minimum orders</li>
            <li>Platters need to be returned the day following pick-up</li>
            <li>Special orders can be made, prices vary</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
