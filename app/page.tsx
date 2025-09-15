import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Utensils, 
  Settings, 
  Users, 
  Heart,
  ArrowRight,
  Sparkles,
  Leaf,
  Smile
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50 z-0"></div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bubblegum text-emerald-900 leading-tight">
            Fresh Meals,
            <span className="block text-emerald-600">Student-Crafted</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the taste of education. PUSD's culinary program offers delicious, nutritious meals prepared by the next generation of chefs.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg shadow-lg">
              <Link href="/menu/amador-valley">
                <Utensils className="mr-2 h-5 w-5" />
                Explore Menus
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/50 backdrop-blur-sm px-8 py-6 text-lg shadow-lg">
              <Link href="/custom-requests">
                <Settings className="mr-2 h-5 w-5" />
                Custom Catering
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bubblegum text-slate-900 mb-4">
              More Than Just a Meal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every order supports hands-on learning and career training for students in our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Leaf}
              title="Fresh & Healthy"
              description="Using locally-sourced ingredients, our students craft nutritious and delicious meals daily."
            />
            <FeatureCard
              icon={Sparkles}
              title="Student-Powered"
              description="Our culinary program is a real-world classroom, giving students invaluable hands-on experience."
            />
            <FeatureCard
              icon={Smile}
              title="Community Focused"
              description="We're proud to serve our school community, bringing staff and students together with great food."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bubblegum text-slate-900 mb-4">
              Simple & Delicious
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting your next great meal is as easy as 1-2-3.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <HowItWorksStep
              step="1"
              title="Browse & Select"
              description="Explore our school menus, featuring fresh, seasonal ingredients and daily specials crafted by students."
            />
            <HowItWorksStep
              step="2"
              title="Order Online"
              description="Place your order securely through our easy-to-use platform and choose your school for pickup."
            />
            <HowItWorksStep
              step="3"
              title="Enjoy & Support"
              description="Pick up your fresh meal and enjoy knowing you're supporting student education with every bite."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bubblegum mb-4">
            Ready to Taste the Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join us in supporting student success. Your next lunch could be a lesson for a future chef.
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-lg">
            <Link href="/menu/amador-valley">
              Start Your Order
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <Card className="text-center border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
    <CardHeader>
      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-emerald-600" />
      </div>
      <CardTitle className="text-2xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-base text-gray-600">
        {description}
      </p>
    </CardContent>
  </Card>
);

const HowItWorksStep = ({ step, title, description }: { step: string, title: string, description: string }) => (
  <div className="text-center space-y-4">
    <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold font-bubblegum shadow-lg">
      {step}
    </div>
    <h3 className="text-3xl font-bubblegum text-slate-900">{title}</h3>
    <p className="text-gray-600 max-w-xs mx-auto">
      {description}
    </p>
  </div>
);