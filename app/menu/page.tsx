"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Star, 
  Plus,
  ShoppingCart,
  Utensils,
  Coffee,
  Apple,
  Pizza,
  Salad
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from the database
const categories = [
  { id: "all", name: "All", icon: Utensils },
  { id: "breakfast", name: "Breakfast", icon: Coffee },
  { id: "lunch", name: "Lunch", icon: Salad },
  { id: "dinner", name: "Dinner", icon: Pizza },
  { id: "snacks", name: "Snacks", icon: Apple },
  { id: "beverages", name: "Beverages", icon: Coffee },
];

const menuItems = [
  {
    id: "1",
    name: "Grilled Chicken Salad",
    description: "Fresh mixed greens with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette",
    price: 12.99,
    category: "lunch",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    popular: true,
    available: true,
    nutritionInfo: {
      calories: 320,
      protein: 28,
      carbs: 12,
      fat: 18
    }
  },
  {
    id: "2",
    name: "Vegetarian Pasta",
    description: "Penne pasta with seasonal vegetables in a light tomato sauce",
    price: 14.99,
    category: "dinner",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
    popular: false,
    available: true,
    nutritionInfo: {
      calories: 450,
      protein: 12,
      carbs: 65,
      fat: 8
    }
  },
  {
    id: "3",
    name: "Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce on a brioche bun",
    price: 16.99,
    category: "lunch",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    popular: true,
    available: true,
    nutritionInfo: {
      calories: 680,
      protein: 35,
      carbs: 45,
      fat: 42
    }
  },
  {
    id: "4",
    name: "Fresh Fruit Bowl",
    description: "Seasonal fresh fruits with honey drizzle and mint garnish",
    price: 8.50,
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    popular: false,
    available: true,
    nutritionInfo: {
      calories: 120,
      protein: 2,
      carbs: 28,
      fat: 0
    }
  },
  {
    id: "5",
    name: "Iced Latte",
    description: "Smooth espresso with cold milk and ice",
    price: 4.99,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    popular: true,
    available: true,
    nutritionInfo: {
      calories: 120,
      protein: 8,
      carbs: 12,
      fat: 5
    }
  },
  {
    id: "6",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan cheese",
    price: 11.99,
    category: "lunch",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    popular: false,
    available: true,
    nutritionInfo: {
      calories: 280,
      protein: 15,
      carbs: 18,
      fat: 20
    }
  },
  {
    id: "7",
    name: "Fish Tacos",
    description: "Grilled fish with cabbage slaw, avocado, and chipotle sauce",
    price: 13.99,
    category: "dinner",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
    popular: false,
    available: true,
    nutritionInfo: {
      calories: 380,
      protein: 25,
      carbs: 35,
      fat: 18
    }
  },
  {
    id: "8",
    name: "Chocolate Milkshake",
    description: "Rich chocolate ice cream blended with milk and chocolate syrup",
    price: 5.99,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    popular: true,
    available: true,
    nutritionInfo: {
      calories: 450,
      protein: 12,
      carbs: 65,
      fat: 18
    }
  }
];

const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
  { value: "popular", label: "Most Popular" },
  { value: "calories", label: "Calories (Low to High)" },
];

export default function Menu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "popular":
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        case "calories":
          return a.nutritionInfo.calories - b.nutritionInfo.calories;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [selectedCategory, searchTerm, sortBy]);

  const addToCart = (item: typeof menuItems[0]) => {
    // In a real app, this would add to cart context/state
    setCartCount(prev => prev + 1);
    alert(`${item.name} added to cart!`);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Utensils;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Utensils className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to view our menu.</p>
          <Button onClick={() => router.push("/auth/signin")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
              <p className="text-gray-600 mt-2">Discover delicious meals prepared with fresh, local ingredients</p>
            </div>
            <Link href="/cart">
              <Button className="relative bg-emerald-600 hover:bg-emerald-700">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button 
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
                setSortBy("name");
              }}
              variant="outline"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 ${
                  selectedCategory === category.id 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  {item.popular && (
                    <Badge className="bg-orange-100 text-orange-800">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <Badge className={item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {item.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="font-bold text-emerald-600">${item.price}</p>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">
                    {(() => {
                      const IconComponent = getCategoryIcon(item.category);
                      return <IconComponent className="h-3 w-3 mr-1" />;
                    })()}
                    {categories.find(c => c.id === item.category)?.name}
                  </Badge>
                  <div className="text-xs text-gray-600">
                    {item.nutritionInfo.calories} cal
                  </div>
                </div>
                
                <Button
                  onClick={() => addToCart(item)}
                  disabled={!item.available}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About Our Menu</CardTitle>
            <CardDescription>Fresh ingredients, local sourcing, and nutritional transparency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Utensils className="h-6 w-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold mb-2">Fresh Ingredients</h4>
                <p className="text-sm text-gray-600">We source the freshest local ingredients for every dish</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold mb-2">Chef-Crafted</h4>
                <p className="text-sm text-gray-600">Every item is carefully crafted by our culinary team</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Filter className="h-6 w-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold mb-2">Dietary Options</h4>
                <p className="text-sm text-gray-600">Vegetarian, vegan, and allergen-free options available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
