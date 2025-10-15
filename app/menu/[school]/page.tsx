"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  Flame,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { toast } from "@/hooks/use-toast";

type School = {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  breakfast: Coffee,
  lunch: Salad,
  dinner: Pizza,
  snacks: Apple,
  beverages: Coffee,
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  image: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  nutritionInfo?: Record<string, number> | null;
};

type SortOption = {
  value: string;
  label: string;
};

const sortOptions: SortOption[] = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
  { value: "featured", label: "Featured" },
  { value: "calories", label: "Calories (Low to High)" },
];

async function fetchMenuForSchool(schoolId: string) {
  const response = await fetch(`/api/menu?schoolId=${schoolId}&available=true`, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to load menu");
  }

  return data.items as MenuItem[];
}

export default function SchoolMenu() {
  const router = useRouter();
  const params = useParams();
  const { cart, addItem } = useCart();

  const schoolSlug = params.school as string;
  
  const [school, setSchool] = useState<School | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingItemId, setAddingItemId] = useState<string | null>(null);

  useEffect(() => {
    const loadSchoolAndMenu = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch school by slug
        const schoolResponse = await fetch(`/api/schools?slug=${schoolSlug}`);
        const schoolData = await schoolResponse.json();
        
        if (!schoolResponse.ok) {
          throw new Error(schoolData?.error || "Failed to load school");
        }
        
        if (!schoolData.schools || schoolData.schools.length === 0) {
          notFound();
          return;
        }
        
        const schoolInfo = schoolData.schools[0] as School;
        setSchool(schoolInfo);
        
        // Fetch menu for this school
        const items = await fetchMenuForSchool(schoolInfo.id);
        
        const categoryMap = new Map<string, { id: string; name: string }>();
        for (const item of items) {
          if (item.category) {
            categoryMap.set(item.category.id, {
              id: item.category.id,
              name: item.category.name,
            });
          }
        }
        
        setMenuItems(items);
        setCategories(Array.from(categoryMap.values()));
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Unable to load menu";
        setError(message);
        toast({ title: "Menu unavailable", description: message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    
    void loadSchoolAndMenu();
  }, [schoolSlug]);

  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) =>
        selectedCategory === "all" ? true : item.categoryId === selectedCategory
      )
      .filter((item) => {
        if (!searchTerm) return true;
        const query = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          (item.description ?? "").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "featured":
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
          case "calories": {
            const caloriesA = a.nutritionInfo?.calories ?? Number.MAX_SAFE_INTEGER;
            const caloriesB = b.nutritionInfo?.calories ?? Number.MAX_SAFE_INTEGER;
            return caloriesA - caloriesB;
          }
          default:
            return 0;
        }
      });
  }, [menuItems, selectedCategory, searchTerm, sortBy]);

  const handleAddToCart = async (menuItemId: string) => {
    try {
      setAddingItemId(menuItemId);
      await addItem({ menuItemId, quantity: 1 });
      toast({ title: "Added to cart", description: "Item added to your cart." });
    } catch (error) {
      if (error instanceof Error && error.message === "unauthorized") {
        router.push("/auth/signin");
        return;
      }

      toast({
        title: "Unable to add item",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setAddingItemId(null);
    }
  };

  const getCategoryIcon = (categoryName?: string | null) => {
    if (!categoryName) return Utensils;
    const key = categoryName.toLowerCase();
    return CATEGORY_ICONS[key] ?? Utensils;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!school) {
    notFound();
  }

  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl md:text-6xl font-bubblegum text-slate-900">
                {school?.name}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Discover delicious meals prepared by our talented students.
              </p>
            </div>
            <Link href="/cart">
              <Button size="lg" className="relative shadow-md">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {cart?.itemCount ? (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 min-w-6 px-1 justify-center rounded-full"
                  >
                    {cart.itemCount}
                  </Badge>
                ) : null}
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 text-base"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white h-11 text-base"
            >
              {sortOptions.map((option) => (
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
              className="h-11 text-base"
            >
              Clear Filters
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="flex items-center space-x-2"
            >
              <Utensils className="h-4 w-4" />
              <span>All</span>
            </Button>
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bubblegum text-slate-800 mb-2">
                  No Items Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or check back later!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const IconComponent = getCategoryIcon(item.category?.name);
              const calories = item.nutritionInfo?.calories;
              return (
                <Card
                  key={item.id}
                  className="overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-56 flex items-center justify-center bg-gray-100 text-gray-400">
                        No image available
                      </div>
                    )}
                    {item.isFeatured && (
                      <Badge className="absolute top-3 right-3 bg-orange-400 text-white">
                        <Star className="h-3 w-3 mr-1" /> Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bubblegum text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-xl font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                      {item.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <Badge variant="outline" className="capitalize">
                        <IconComponent className="h-3 w-3 mr-1.5" />
                        {item.category?.name ?? "General"}
                      </Badge>
                      {calories ? (
                        <div className="flex items-center">
                          <Flame className="h-4 w-4 mr-1 text-orange-500" /> {calories} cal
                        </div>
                      ) : null}
                    </div>
                    <Button
                      onClick={() => handleAddToCart(item.id)}
                      disabled={!item.isAvailable || addingItemId === item.id}
                      className="w-full text-base py-3"
                      size="lg"
                    >
                      {addingItemId === item.id ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5 mr-2" /> Add to Cart
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
