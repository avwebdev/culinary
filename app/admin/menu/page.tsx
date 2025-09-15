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
  X
} from "lucide-react";
import Link from "next/link";

const categories = [
  { id: "1", name: "Breakfast", color: "bg-yellow-100 text-yellow-800" },
  { id: "2", name: "Lunch", color: "bg-blue-100 text-blue-800" },
  { id: "3", name: "Dinner", color: "bg-purple-100 text-purple-800" },
  { id: "4", name: "Snacks", color: "bg-green-100 text-green-800" },
  { id: "5", name: "Beverages", color: "bg-red-100 text-red-800" },
];

const menuItems = [
  { id: "1", name: "Grilled Chicken Salad", description: "Fresh mixed greens with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette", price: 12.99, category: "Lunch", categoryId: "2", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", available: true, popular: true, allergens: ["nuts"] },
  { id: "2", name: "Vegetarian Pasta", description: "Penne pasta with seasonal vegetables in a light tomato sauce", price: 14.99, category: "Dinner", categoryId: "3", image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop", available: true, popular: false, allergens: ["gluten"] },
  { id: "3", name: "Beef Burger", description: "Juicy beef patty with lettuce, tomato, and special sauce on a brioche bun", price: 16.99, category: "Lunch", categoryId: "2", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", available: true, popular: true, allergens: ["gluten", "dairy"] },
];

export default function AdminMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", categoryId: "", image: "", available: true, popular: false });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "admin") router.push("/");
  }, [session, status, router]);

  useEffect(() => {
    let filtered = menuItems;
    if (categoryFilter !== "all") filtered = filtered.filter(item => item.categoryId === categoryFilter);
    if (searchTerm) filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredItems(filtered);
  }, [categoryFilter, searchTerm]);

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", categoryId: "", image: "", available: true, popular: false });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description, price: item.price.toString(), categoryId: item.categoryId, image: item.image, available: item.available, popular: item.popular });
    setShowForm(true);
  };
  
  const handleSubmit = () => {
    if (editingItem) {
      console.log("Updating item:", editingItem.id, formData);
      alert("Menu item updated!");
    } else {
      console.log("Adding new item:", formData);
      alert("Menu item added!");
    }
    resetForm();
  };

  const handleDelete = (itemId: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      console.log("Deleting item:", itemId);
      alert("Menu item deleted!");
    }
  };

  if (status === "loading" || !session || session.user?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <Link href="/admin"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
              <h1 className="text-4xl font-bubblegum text-slate-900">Menu Management</h1>
            </div>
            <p className="text-lg text-gray-600 mt-2">Manage your menu items, categories, and pricing.</p>
          </div>
          <Button onClick={() => setShowForm(true)} size="lg"><Plus className="h-5 w-5 mr-2" />Add Menu Item</Button>
        </div>

        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" placeholder="Search menu items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-emerald-500 focus:border-emerald-500 h-11 text-base"/></div>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white h-11 text-base"><option value="all">All Categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              <Button onClick={() => { setCategoryFilter("all"); setSearchTerm(""); }} variant="outline" className="h-11 text-base">Clear Filters</Button>
            </div>
          </CardContent>
        </Card>

        {showForm && (
          <Card className="mb-6 shadow-lg">
            <CardHeader><CardTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><Label htmlFor="name">Item Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Supreme Pizza"/></div>
                <div><Label htmlFor="price">Price</Label><Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="15.99"/></div>
                <div className="md:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="A short, tasty description..."/></div>
                <div><Label htmlFor="category">Category</Label><select id="category" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white h-10"><option value="">Select Category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div><Label htmlFor="image">Image URL</Label><Input id="image" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..."/></div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={resetForm}><X className="h-4 w-4 mr-2" />Cancel</Button>
                <Button onClick={handleSubmit}>{editingItem ? "Update Item" : "Add Item"}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-lg"/>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-lg font-bold text-emerald-600">${item.price}</p>
                </div>
                <p className="text-sm text-gray-600 mb-3 h-10">{item.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={categories.find(c => c.id === item.categoryId)?.color}>{item.category}</Badge>
                  <Badge variant={item.available ? "default" : "destructive"}>{item.available ? "Available" : "Unavailable"}</Badge>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 mr-1" />Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="shadow-sm"><CardContent className="pt-6"><div className="text-center py-12"><Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-bubblegum text-slate-800 mb-2">No menu items found</h3><p className="text-gray-500">Try adjusting your filters or add a new item.</p></div></CardContent></Card>
        )}
      </div>
    </div>
  );
}