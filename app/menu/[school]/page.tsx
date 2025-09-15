"use client";

import { useSession } from "next-auth/react";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Plus,
  ShoppingCart,
  Utensils,
  Coffee,
  Apple,
  Pizza,
  Salad,
  Filter,
  Flame,
  Info
} from "lucide-react";
import Link from "next/link";

const schoolSlugs: { [key: string]: string } = {
  "amador-valley": "Amador Valley High School",
  "foothill": "Foothill High School",
  "village": "Village High School"
};

const categories = [
  { id: "all", name: "All", icon: Utensils },
  { id: "breakfast", name: "Breakfast", icon: Coffee },
  { id: "lunch", name: "Lunch", icon: Salad },
  { id: "dinner", name: "Dinner", icon: Pizza },
  { id: "snacks", name: "Snacks", icon: Apple },
  { id: "beverages", name: "Beverages", icon: Coffee },
];

const allMenuItems = [
  { id: "1", name: "Grilled Chicken Salad", description: "Fresh mixed greens with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette", price: 12.99, category: "lunch", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", popular: true, available: true, schoolId: "amador-valley", nutritionInfo: { calories: 320, protein: 28, carbs: 12, fat: 18 }},
  { id: "2", name: "Vegetarian Pasta", description: "Penne pasta with seasonal vegetables in a light tomato sauce", price: 14.99, category: "dinner", image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop", popular: false, available: true, schoolId: "foothill", nutritionInfo: { calories: 450, protein: 12, carbs: 65, fat: 8 }},
  { id: "3", name: "Beef Burger", description: "Juicy beef patty with lettuce, tomato, and special sauce on a brioche bun", price: 16.99, category: "lunch", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", popular: true, available: true, schoolId: "amador-valley", nutritionInfo: { calories: 680, protein: 35, carbs: 45, fat: 42 }},
  { id: "4", name: "Fresh Fruit Bowl", description: "Seasonal fresh fruits with honey drizzle and mint garnish", price: 8.50, category: "breakfast", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop", popular: false, available: true, schoolId: "village", nutritionInfo: { calories: 120, protein: 2, carbs: 28, fat: 0 }},
  { id: "5", name: "Iced Latte", description: "Smooth espresso with cold milk and ice", price: 4.99, category: "beverages", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop", popular: true, available: true, schoolId: "foothill", nutritionInfo: { calories: 120, protein: 8, carbs: 12, fat: 5 }},
  { id: "6", name: "Avocado Toast", description: "Toasted sourdough with fresh avocado, chili flakes, and a squeeze of lime.", price: 9.50, category: "breakfast", image: "https://images.unsplash.com/photo-1584308666744-8480404b65ae?w=400&h=300&fit=crop", popular: true, available: true, schoolId: "amador-valley", nutritionInfo: { calories: 280, protein: 8, carbs: 25, fat: 18 }},
  { id: "7", name: "Club Sandwich", description: "Classic triple-decker with turkey, bacon, lettuce, and tomato.", price: 13.50, category: "lunch", image: "https://images.unsplash.com/photo-1592415486689-125cbbfcbee2?w=400&h=300&fit=crop", popular: false, available: true, schoolId: "foothill", nutritionInfo: { calories: 550, protein: 30, carbs: 40, fat: 30 }},
];

const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
  { value: "popular", label: "Most Popular" },
  { value: "calories", label: "Calories (Low to High)" },
];

export default function SchoolMenu() {
  const { data: session, status } = useSession();
  const params = useParams();
  const schoolSlug = params.school as string;

  const schoolName = schoolSlugs[schoolSlug];
  const schoolMenuItems = allMenuItems.filter(item => item.schoolId === schoolSlug);

  const [filteredItems, setFilteredItems] = useState(schoolMenuItems);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (status === "loading") return;
  }, [session, status]);

  useEffect(() => {
    let filtered = schoolMenuItems;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name);
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "popular": return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        case "calories": return a.nutritionInfo.calories - b.nutritionInfo.calories;
        default: return 0;
      }
    });

    setFilteredItems(filtered);
  }, [selectedCategory, searchTerm, sortBy, schoolMenuItems]);

  if (!schoolName) {
    notFound();
  }

  const addToCart = (item: typeof schoolMenuItems[0]) => {
    setCartCount(prev => prev + 1);
  };

  const getCategoryIcon = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.icon || Utensils;
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div></div>;
  }

  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-bubblegum text-slate-900">{schoolName}</h1>
              <p className="mt-2 text-lg text-gray-600">Discover delicious meals prepared by our talented students.</p>
            </div>
            <Link href="/cart">
              <Button size="lg" className="relative shadow-md">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 justify-center rounded-full">{cartCount}</Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input placeholder="Search menu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 text-base"/>
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white h-11 text-base">
              {sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <Button onClick={() => { setSelectedCategory("all"); setSearchTerm(""); setSortBy("name"); }} variant="outline" className="h-11 text-base">Clear Filters</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} onClick={() => setSelectedCategory(category.id)} className="flex items-center space-x-2">
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative">
                <img src={item.image} alt={item.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                {item.popular && (
                  <Badge className="absolute top-3 right-3 bg-orange-400 text-white">
                    <Star className="h-3 w-3 mr-1" /> Popular
                  </Badge>
                )}
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bubblegum text-slate-900">{item.name}</h3>
                  <p className="text-xl font-bold text-emerald-600">${item.price}</p>
                </div>
                <p className="text-sm text-gray-600 mb-4 h-10">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                   <Badge variant="outline" className="capitalize">
                    {(() => {
                      const IconComponent = getCategoryIcon(item.category);
                      return <IconComponent className="h-3 w-3 mr-1.5" />;
                    })()}
                    {item.category}
                  </Badge>
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-1 text-orange-500"/> {item.nutritionInfo.calories} cal
                  </div>
                </div>
                <Button onClick={() => addToCart(item)} disabled={!item.available} className="w-full text-base py-3" size="lg">
                  <Plus className="h-5 w-5 mr-2" /> Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bubblegum text-slate-800 mb-2">No Items Found</h3>
                <p className="text-gray-500">Try adjusting your filters or check back later!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}