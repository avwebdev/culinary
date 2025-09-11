"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Utensils, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Search,
  Filter,
  DollarSign,
  Tag,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from the database
const categories = [
  { id: "1", name: "Breakfast", color: "bg-yellow-100 text-yellow-800" },
  { id: "2", name: "Lunch", color: "bg-blue-100 text-blue-800" },
  { id: "3", name: "Dinner", color: "bg-purple-100 text-purple-800" },
  { id: "4", name: "Snacks", color: "bg-green-100 text-green-800" },
  { id: "5", name: "Beverages", color: "bg-red-100 text-red-800" },
];

const menuItems = [
  {
    id: "1",
    name: "Grilled Chicken Salad",
    description: "Fresh mixed greens with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette",
    price: 12.99,
    category: "Lunch",
    categoryId: "2",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    available: true,
    popular: true,
    allergens: ["nuts"],
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
    category: "Dinner",
    categoryId: "3",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
    available: true,
    popular: false,
    allergens: ["gluten"],
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
    category: "Lunch",
    categoryId: "2",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    available: true,
    popular: true,
    allergens: ["gluten", "dairy"],
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
    category: "Breakfast",
    categoryId: "1",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    available: true,
    popular: false,
    allergens: [],
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
    category: "Beverages",
    categoryId: "5",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    available: true,
    popular: true,
    allergens: ["dairy"],
    nutritionInfo: {
      calories: 120,
      protein: 8,
      carbs: 12,
      fat: 5
    }
  }
];

export default function AdminMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: "",
    available: true,
    popular: false,
    allergens: [] as string[],
    nutritionInfo: {
      calories: "",
      protein: "",
      carbs: "",
      fat: ""
    }
  });

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user?.role !== "admin") {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.categoryId === categoryFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [categoryFilter, searchTerm]);

  const handleAddItem = () => {
    // In a real app, this would save to the database
    console.log("Adding new item:", formData);
    alert("Menu item added successfully!");
    setShowAddForm(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      image: "",
      available: true,
      popular: false,
      allergens: [],
      nutritionInfo: { calories: "", protein: "", carbs: "", fat: "" }
    });
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: item.categoryId,
      image: item.image,
      available: item.available,
      popular: item.popular,
      allergens: item.allergens,
      nutritionInfo: {
        calories: item.nutritionInfo.calories.toString(),
        protein: item.nutritionInfo.protein.toString(),
        carbs: item.nutritionInfo.carbs.toString(),
        fat: item.nutritionInfo.fat.toString()
      }
    });
    setShowAddForm(true);
  };

  const handleUpdateItem = () => {
    // In a real app, this would update the database
    console.log("Updating item:", editingItem.id, formData);
    alert("Menu item updated successfully!");
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      image: "",
      available: true,
      popular: false,
      allergens: [],
      nutritionInfo: { calories: "", protein: "", carbs: "", fat: "" }
    });
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      // In a real app, this would delete from the database
      console.log("Deleting item:", itemId);
      alert("Menu item deleted successfully!");
    }
  };

  const toggleAvailability = (itemId: string) => {
    // In a real app, this would update the database
    console.log("Toggling availability for item:", itemId);
    alert("Item availability updated!");
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

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
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
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                                  <Button variant="ghost" size="sm" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
              </div>
              <p className="text-gray-600 mt-2">Manage your menu items, categories, and pricing</p>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setCategoryFilter("all");
                    setSearchTerm("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</CardTitle>
              <CardDescription>
                {editingItem ? "Update the menu item details below" : "Fill in the details for the new menu item"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter item name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter item description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="available"
                        checked={formData.available}
                        onChange={(e) => setFormData({...formData, available: e.target.checked})}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Label htmlFor="available">Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="popular"
                        checked={formData.popular}
                        onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Label htmlFor="popular">Popular Item</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      categoryId: "",
                      image: "",
                      available: true,
                      popular: false,
                      allergens: [],
                      nutritionInfo: { calories: "", protein: "", carbs: "", fat: "" }
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {editingItem ? "Update Item" : "Add Item"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  {item.popular && (
                    <Badge className="bg-orange-100 text-orange-800">Popular</Badge>
                  )}
                  <Badge className={item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {item.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-lg font-bold text-emerald-600">${item.price}</p>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <Badge className={categories.find(c => c.id === item.categoryId)?.color}>
                    {item.category}
                  </Badge>
                  <div className="text-xs text-gray-500">
                    {item.nutritionInfo.calories} cal
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditItem(item)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAvailability(item.id)}
                      className={item.available ? "text-red-600 border-red-600" : "text-green-600 border-green-600"}
                    >
                      {item.available ? "Disable" : "Enable"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
                <p className="text-gray-500">Try adjusting your filters or add a new menu item.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
