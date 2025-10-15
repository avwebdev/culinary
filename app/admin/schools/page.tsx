"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X, Plus, Edit, Trash2, Loader2, School } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { createSchoolSchema } from "@/lib/validators/school";

type School = {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function SchoolsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof createSchoolSchema>>({
    resolver: zodResolver(createSchoolSchema),
    defaultValues: {
      name: "",
      slug: "",
      address: "",
      phone: "",
      email: "",
      isActive: true,
    },
  });

  // Check authentication
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/auth/signin");
    if (session?.user?.role !== "admin") router.push("/");
  }, [session, status, router]);

  // Check for add parameter in URL
  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user?.role === "admin" && !isLoading) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('add') === 'true') {
        setCurrentSchool(null);
        form.reset({
          name: "",
          slug: "",
          address: "",
          phone: "",
          email: "",
          isActive: true,
        });
        setDialogOpen(true);
        
        // Update the URL without the query parameter
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [session, isLoading]);

  // Load schools
  useEffect(() => {
    const loadSchools = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/schools?includeInactive=true");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load schools");
        }

        setSchools(data.schools || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load schools";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.role === "admin") {
      loadSchools();
    }
  }, [session]);

  // Open dialog for editing
  const openEditDialog = (school: School) => {
    setCurrentSchool(school);
    form.reset({
      name: school.name,
      slug: school.slug,
      address: school.address || "",
      phone: school.phone || "",
      email: school.email || "",
      isActive: school.isActive,
    });
    setDialogOpen(true);
  };

  // Open dialog for adding
  const openAddDialog = () => {
    setCurrentSchool(null);
    form.reset({
      name: "",
      slug: "",
      address: "",
      phone: "",
      email: "",
      isActive: true,
    });
    setDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  // Generate slug from name
  const generateSlugFromName = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof createSchoolSchema>) => {
    try {
      setIsSubmitting(true);
      let response;

      if (currentSchool) {
        // Update existing school
        response = await fetch(`/api/schools/${currentSchool.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        // Create new school
        response = await fetch("/api/schools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Operation failed");
      }

      toast({
        title: currentSchool ? "School updated" : "School created",
        description: `${data.name} has been ${currentSchool ? "updated" : "added"} successfully.`,
      });

      setDialogOpen(false);

      // Refresh schools list
      const refreshResponse = await fetch("/api/schools?includeInactive=true");
      const refreshData = await refreshResponse.json();
      setSchools(refreshData.schools || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle school deletion
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/schools/${deleteId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete school");
      }

      toast({
        title: "School deleted",
        description: "The school has been deleted successfully.",
      });

      setDeleteDialogOpen(false);
      
      // Refresh schools list
      const refreshResponse = await fetch("/api/schools?includeInactive=true");
      const refreshData = await refreshResponse.json();
      setSchools(refreshData.schools || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete school";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter schools based on active tab
  const filteredSchools = schools.filter(school => {
    if (activeTab === "active") return school.isActive;
    if (activeTab === "inactive") return !school.isActive;
    return true;
  });

  if (status === "loading" || !session || session.user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Schools Management</h1>
            <p className="text-gray-500 mt-1">Add, edit, and manage schools in the system.</p>
          </div>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add School
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Schools</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredSchools.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <School className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500">No schools found.</p>
                  <Button variant="outline" className="mt-4" onClick={openAddDialog}>
                    Add a School
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchools.map((school) => (
                  <Card key={school.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{school.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">/{school.slug}</p>
                        </div>
                        <Badge variant={school.isActive ? "default" : "secondary"}>
                          {school.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-1 text-sm">
                      {school.address && (
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Address:</span> {school.address}
                        </p>
                      )}
                      {school.phone && (
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Phone:</span> {school.phone}
                        </p>
                      )}
                      {school.email && (
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Email:</span> {school.email}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 pt-3">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(school)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(school.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* School Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {currentSchool ? "Edit School" : "Add New School"}
            </DialogTitle>
            <DialogDescription>
              {currentSchool
                ? "Update the school's information below."
                : "Fill in the details to add a new school to the system."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Amador Valley High School"
                        onChange={(e) => {
                          field.onChange(e);
                          if (!currentSchool && !form.getValues("slug")) {
                            form.setValue("slug", generateSlugFromName(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. amador-valley" />
                    </FormControl>
                    <FormDescription>
                      Used in the URL: /menu/{field.value || "school-slug"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="School address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Contact email" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Only active schools are shown on the public site.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {currentSchool ? "Update School" : "Add School"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this school? This action will deactivate the school rather than completely removing it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate School
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}