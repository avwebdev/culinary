"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  Calendar,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from the database
const schools = [
  { id: "1", name: "Amador Valley High School", address: "1155 Santa Rita Rd, Pleasanton, CA 94566" },
  { id: "2", name: "Foothill High School", address: "4375 Foothill Rd, Pleasanton, CA 94588" },
  { id: "3", name: "Village High School", address: "4645 Bernal Ave, Pleasanton, CA 94566" },
  { id: "4", name: "Hart Middle School", address: "4433 Willow Rd, Pleasanton, CA 94588" },
  { id: "5", name: "Pleasanton Middle School", address: "5001 Case Ave, Pleasanton, CA 94566" },
];

const requestTypes = [
  { id: "dietary", name: "Dietary Restrictions", description: "Allergies, intolerances, or special diets" },
  { id: "celebration", name: "Celebration/Event", description: "Special occasions or group events" },
  { id: "cultural", name: "Cultural/Religious", description: "Cultural or religious dietary requirements" },
  { id: "health", name: "Health/Medical", description: "Medical conditions requiring special meals" },
  { id: "other", name: "Other", description: "Other special requests" },
];

const sampleRequests = [
  {
    id: "1",
    title: "Gluten-Free Birthday Cake",
    description: "Need a gluten-free birthday cake for a student with celiac disease",
    type: "dietary",
    status: "approved",
    estimatedPrice: 45.00,
    submittedDate: "2024-01-10",
    school: "Amador Valley High School",
  },
  {
    id: "2",
    title: "Vegan Graduation Dinner",
    description: "Requesting a vegan menu option for graduation dinner celebration",
    type: "celebration",
    status: "pending",
    estimatedPrice: 25.00,
    submittedDate: "2024-01-12",
    school: "Foothill High School",
  },
  {
    id: "3",
    title: "Kosher Meal Options",
    description: "Looking for kosher meal options for Jewish students",
    type: "cultural",
    status: "in-review",
    estimatedPrice: 30.00,
    submittedDate: "2024-01-08",
    school: "Village High School",
  },
];

export default function CustomRequestsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    schoolId: "",
    requestType: "",
    estimatedPrice: "",
    specialInstructions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.schoolId || !formData.requestType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would make an API call to create the request
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Request Submitted!",
        description: "Your custom request has been submitted and is under review. We'll contact you within 24-48 hours.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        schoolId: "",
        requestType: "",
        estimatedPrice: "",
        specialInstructions: "",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "in-review":
        return "text-blue-600 bg-blue-100";
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Sign In Required</CardTitle>
            <CardDescription className="text-center">
              Please sign in to submit custom requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <a href="/auth/signin">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Custom Requests</h1>
          <p className="text-gray-600">
            Have a special dietary need or celebration? Submit a custom request and we'll work with you to create the perfect meal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-emerald-600" />
                  Submit Custom Request
                </CardTitle>
                <CardDescription>
                  Tell us about your special request and we'll work with you to make it happen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Request Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Request Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Gluten-Free Birthday Cake"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Request Type */}
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Request Type *</Label>
                    <Select value={formData.requestType} onValueChange={(value) => setFormData({ ...formData, requestType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        {requestTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{type.name}</span>
                              <span className="text-sm text-gray-500">{type.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* School Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="school">School Location *</Label>
                    <Select value={formData.schoolId} onValueChange={(value) => setFormData({ ...formData, schoolId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a school location" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{school.name}</span>
                              <span className="text-sm text-gray-500">{school.address}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide detailed information about your request, including any specific requirements, dietary restrictions, allergies, or special circumstances..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Estimated Price */}
                  <div className="space-y-2">
                    <Label htmlFor="estimatedPrice">Estimated Budget (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="estimatedPrice"
                        type="number"
                        placeholder="0.00"
                        value={formData.estimatedPrice}
                        onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                        className="pl-10"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      This helps us understand your budget expectations. Final pricing will be determined after review.
                    </p>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">Additional Notes</Label>
                    <Textarea
                      id="specialInstructions"
                      placeholder="Any additional information, timing requirements, or special considerations..."
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting Request..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Submit Request</p>
                    <p className="text-sm text-gray-600">Fill out the form with your special requirements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Review Process</p>
                    <p className="text-sm text-gray-600">Our team reviews your request within 24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Custom Solution</p>
                    <p className="text-sm text-gray-600">We work with you to create the perfect meal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Request Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Submit requests at least 3-5 business days in advance
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Include all dietary restrictions and allergies
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Provide specific details about your needs
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Pricing may vary based on complexity and ingredients
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Examples of custom requests we've handled</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleRequests.map((request) => (
                  <div key={request.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{request.title}</h4>
                      <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{request.school}</span>
                      <span>${request.estimatedPrice}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
