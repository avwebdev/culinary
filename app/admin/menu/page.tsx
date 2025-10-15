"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Utensils,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  X,
  Loader2,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

type School = {
  id: string;
  name: string;
  address?: string | null;
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string | null;
  schoolId: string | null;
  image: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isCustomizable: boolean;
  allergens: string[];
  nutritionInfo: Record<string, number>;
  preparationTime: number | null;
  sortOrder: number | null;
  category?: Category | null;
  school?: School | null;
};

type FormState = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  schoolId: string;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isCustomizable: boolean;
  allergens: string;
  preparationTime: string;
  sortOrder: string;
};

const emptyFormState: FormState = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  schoolId: "",
  image: "",
  isAvailable: true,
  isFeatured: false,
  isCustomizable: false,
  allergens: "",
  preparationTime: "",
  sortOrder: "",
};

async function fetchJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error ?? "Request failed");
  }

  return data as T;
}

export default function AdminMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [schoolFilter, setSchoolFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formState, setFormState] = useState<FormState>(emptyFormState);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = session?.user?.role === "admin";
  const hasLookups = categories.length > 0 && schools.length > 0;

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session || !isAdmin) {
      router.push("/");
    }
  }, [session, status, isAdmin, router]);

  useEffect(() => {
    if (status !== "authenticated" || !isAdmin) {
      return;
    }

    const loadData = async () => {
      try {
        setError(null);
        setInitializing(true);

        const [menuData, categoryData, schoolData] = await Promise.all([
          fetchJson<{ items: MenuItem[] }>("/api/menu"),
          fetchJson<{ categories: Category[] }>("/api/categories"),
          fetchJson<{ schools: School[] }>("/api/schools"),
        ]);

        setMenuItems(menuData.items ?? []);
        setCategories(categoryData.categories ?? []);
        setSchools(schoolData.schools ?? []);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error ? fetchError.message : "Failed to load data";
        setError(message);
        toast({
          title: "Unable to load data",
          description: message,
          variant: "destructive",
        });
      } finally {
        setInitializing(false);
      }
    };

    void loadData();
  }, [status, isAdmin]);

  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) =>
        schoolFilter === "all" ? true : item.schoolId === schoolFilter
      )
      .filter((item) =>
        categoryFilter === "all" ? true : item.categoryId === categoryFilter
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
        const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.name.localeCompare(b.name);
      });
  }, [menuItems, schoolFilter, categoryFilter, searchTerm]);

  const resetForm = () => {
    setFormState(emptyFormState);
    setEditingItem(null);
    setShowForm(false);
  };

  const populateForm = (item: MenuItem) => {
    setFormState({
      name: item.name,
      description: item.description ?? "",
      price: item.price.toString(),
      categoryId: item.categoryId ?? "",
      schoolId: item.schoolId ?? "",
      image: item.image ?? "",
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      isCustomizable: item.isCustomizable,
      allergens: item.allergens?.join(", ") ?? "",
      preparationTime: item.preparationTime?.toString() ?? "",
      sortOrder: item.sortOrder?.toString() ?? "",
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleQuickAddCategory = async () => {
    const name = window.prompt("New category name");
    if (!name) {
      return;
    }

    try {
      const payload = { name: name.trim(), sortOrder: categories.length + 1 };
      const data = await fetchJson<{ category: Category }>("/api/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setCategories((prev) => [...prev, data.category]);
      setFormState((prev) => ({ ...prev, categoryId: data.category.id }));
      toast({
        title: "Category created",
        description: `${data.category.name} is now available.`,
      });
    } catch (categoryError) {
      toast({
        title: "Could not create category",
        description:
          categoryError instanceof Error ? categoryError.message : "Unexpected error",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!formState.name.trim()) {
      toast({
        title: "Name is required",
        description: "Please provide a name for the menu item.",
        variant: "destructive",
      });
      return;
    }

    const price = Number(formState.price);
    if (!Number.isFinite(price) || price < 0) {
      toast({
        title: "Invalid price",
        description: "Enter a valid price greater than or equal to zero.",
        variant: "destructive",
      });
      return;
    }

    if (!formState.categoryId || !formState.schoolId) {
      toast({
        title: "Missing selections",
        description: "Please choose both a school and a category.",
        variant: "destructive",
      });
      return;
    }

    const preparationTime = formState.preparationTime
      ? Number(formState.preparationTime)
      : undefined;

    if (
      preparationTime !== undefined &&
      (!Number.isInteger(preparationTime) || preparationTime < 0)
    ) {
      toast({
        title: "Invalid preparation time",
        description: "Preparation time must be a positive whole number.",
        variant: "destructive",
      });
      return;
    }

    const sortOrder = formState.sortOrder ? Number(formState.sortOrder) : undefined;
    if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
      toast({
        title: "Invalid sort order",
        description: "Sort order must be a whole number.",
        variant: "destructive",
      });
      return;
    }

    const allergens = formState.allergens
      ? formState.allergens
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [];

    const payload = {
      name: formState.name.trim(),
      description: formState.description.trim() || undefined,
      price,
      categoryId: formState.categoryId,
      schoolId: formState.schoolId,
      image: formState.image.trim() || undefined,
      isAvailable: formState.isAvailable,
      isFeatured: formState.isFeatured,
      isCustomizable: formState.isCustomizable,
      allergens,
      preparationTime,
      sortOrder,
    };

    try {
      setSubmitting(true);
      const data = await fetchJson<{ item: MenuItem }>(
        editingItem ? `/api/menu/${editingItem.id}` : "/api/menu",
        {
          method: editingItem ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        }
      );

      setMenuItems((prev) => {
        if (editingItem) {
          return prev.map((item) => (item.id === editingItem.id ? data.item : item));
        }
        return [...prev, data.item];
      });

      toast({
        title: editingItem ? "Menu item updated" : "Menu item added",
        description: `${data.item.name} has been saved successfully.`,
      });

      resetForm();
    } catch (submitError) {
      toast({
        title: editingItem ? "Update failed" : "Creation failed",
        description:
          submitError instanceof Error ? submitError.message : "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      setDeletingId(itemId);
      await fetchJson(`/api/menu/${itemId}`, { method: "DELETE" });
      setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
      toast({
        title: "Menu item deleted",
        description: "The item has been removed.",
      });
    } catch (deleteError) {
      toast({
        title: "Failed to delete",
        description:
          deleteError instanceof Error ? deleteError.message : "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const renderLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );

  if (
    status === "loading" ||
    !session ||
    session.user?.role !== "admin" ||
    initializing
  ) {
    return renderLoader();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-4xl font-bubblegum text-slate-900">
                Menu Management
              </h1>
            </div>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl">
              Create, edit, and organise the items that appear on each school menu.
            </p>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
              setFormState(emptyFormState);
            }}
            size="lg"
            disabled={!hasLookups}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Menu Item
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!hasLookups && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Add at least one school and one category before creating menu items.
          </div>
        )}

        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-primary focus:border-primary h-11 text-base"
                />
              </div>

              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="All Schools" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {showForm && (
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle>
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Supreme Pizza"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.price}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="15.99"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formState.description}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="A short, tasty description..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="school">School</Label>
                  <Select
                    value={formState.schoolId || undefined}
                    onValueChange={(value) =>
                      setFormState((prev) => ({ ...prev, schoolId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select School" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="category">Category</Label>
                    <Button variant="ghost" size="sm" onClick={handleQuickAddCategory}>
                      Quick add
                    </Button>
                  </div>
                  <Select
                    value={formState.categoryId || undefined}
                    onValueChange={(value) =>
                      setFormState((prev) => ({ ...prev, categoryId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formState.image}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, image: e.target.value }))
                    }
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="allergens">Allergens (comma separated)</Label>
                  <Input
                    id="allergens"
                    value={formState.allergens}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        allergens: e.target.value,
                      }))
                    }
                    placeholder="nuts, gluten, dairy"
                  />
                </div>

                <div>
                  <Label htmlFor="preparationTime">Preparation Time (minutes)</Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    min="0"
                    step="1"
                    value={formState.preparationTime}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        preparationTime: e.target.value,
                      }))
                    }
                    placeholder="15"
                  />
                </div>

                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    step="1"
                    value={formState.sortOrder}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        sortOrder: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={formState.isAvailable}
                    onCheckedChange={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        isAvailable: value === true,
                      }))
                    }
                  />
                  <Label htmlFor="available" className="font-normal">
                    Available for ordering
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formState.isFeatured}
                    onCheckedChange={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        isFeatured: value === true,
                      }))
                    }
                  />
                  <Label htmlFor="featured" className="font-normal">
                    Mark as featured
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customizable"
                    checked={formState.isCustomizable}
                    onCheckedChange={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        isCustomizable: value === true,
                      }))
                    }
                  />
                  <Label htmlFor="customizable" className="font-normal">
                    Allow customisations
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={resetForm} disabled={submitting}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingItem ? "Update Item" : "Add Item"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredItems.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bubblegum text-slate-800 mb-2">
                  No menu items found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or add a new item.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-t-lg text-gray-400">
                    No image
                  </div>
                )}
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-lg font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 min-h-[40px]">
                    {item.description || "No description provided."}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">
                      {item.category?.name ?? "Uncategorised"}
                    </Badge>
                    {item.school?.name && (
                      <Badge variant="outline">{item.school.name}</Badge>
                    )}
                    <Badge variant={item.isAvailable ? "default" : "destructive"}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                    {item.isFeatured && (
                      <Badge className="bg-orange-400 text-white">
                        <Star className="h-3 w-3 mr-1" /> Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => populateForm(item)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
