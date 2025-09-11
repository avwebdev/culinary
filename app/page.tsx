
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Utensils, 
  Calendar, 
  Users, 
  Clock, 
  Star, 
  Heart,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                PUSD Culinary
                <span className="block text-emerald-600">Department</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Fresh, nutritious, and delicious meals prepared with care for our school community. 
                Order online, make reservations, and enjoy quality dining experiences.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/menu">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg">
                  <Utensils className="mr-2 h-5 w-5" />
                  View Menu & Order
                </Button>
              </Link>
              <Link href="/reservations">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 text-lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Make Reservation
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-200 rounded-full opacity-30"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose PUSD Culinary?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional dining experiences with fresh, 
              locally-sourced ingredients and outstanding service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Fresh & Healthy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Locally sourced ingredients, fresh daily, with nutrition in mind
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Convenient Ordering</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Order online, skip the line, and pick up at your convenience
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Community Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Supporting our school community with quality dining experiences
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Award-winning culinary team dedicated to quality and service
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting your delicious meal is simple and convenient
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Browse & Select</h3>
              <p className="text-gray-600">
                Explore our diverse menu featuring fresh, seasonal ingredients and daily specials
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Order Online</h3>
              <p className="text-gray-600">
                Place your order through our easy-to-use platform and choose your pickup time
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Enjoy Your Meal</h3>
              <p className="text-gray-600">
                Pick up your fresh, delicious meal and enjoy with family and friends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Experience Great Food?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of satisfied diners and discover why PUSD Culinary is the choice for quality school dining.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Start Ordering
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
