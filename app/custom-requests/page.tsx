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
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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

export default function CustomRequestsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventDate, setEventDate] = useState<Date>();
  const [pickupDate, setPickupDate] = useState<Date>();
  const [deliveryDate, setDeliveryDate] = useState<Date>();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventTime: "",
    partySize: "",
    description: "",
    dietaryRestrictions: "",
    schoolId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !eventDate || !formData.eventTime || !formData.partySize || !formData.description) {
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
        description: "Your custom request has been submitted. A culinary teacher will reach out to you with a quote as soon as they are able.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventTime: "",
        partySize: "",
        description: "",
        dietaryRestrictions: "",
        schoolId: "",
      });
      setEventDate(undefined);
      setPickupDate(undefined);
      setDeliveryDate(undefined);

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Custom Catering Requests</h1>
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
                  A culinary teacher will reach out to you with a quote for the below request as soon as they are able. Payment can be made via a donation through FutureFund, cash, or check.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Name of Person Ordering *</Label>
                      <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="partySize">Number of People Anticipated *</Label>
                      <Input id="partySize" type="number" placeholder="e.g., 15" value={formData.partySize} onChange={(e) => setFormData({...formData, partySize: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Event *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !eventDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={eventDate}
                            onSelect={setEventDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="eventTime">Time of Event *</Label>
                      <Input id="eventTime" type="time" value={formData.eventTime} onChange={(e) => setFormData({...formData, eventTime: e.target.value})} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Please describe what you would like for your custom catering experience *</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your event, desired menu, service style (e.g., buffet, plated), and any other key details."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                    <Textarea
                      id="dietaryRestrictions"
                      placeholder="e.g., Gluten-free, vegetarian, nut allergies, etc."
                      value={formData.dietaryRestrictions}
                      onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Do you have a school preference for fulfilling your order?</Label>
                    <Select value={formData.schoolId} onValueChange={(value) => setFormData({ ...formData, schoolId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a school location (optional)" />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Date of Pick Up</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !pickupDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {pickupDate ? format(pickupDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={pickupDate}
                            onSelect={setPickupDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-gray-500">Pickup must be between 8:00 AM and 2:30 PM.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Delivery</Label>
                       <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !deliveryDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {deliveryDate ? format(deliveryDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={deliveryDate}
                            onSelect={setDeliveryDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-gray-500">Delivery fees will be assessed.</p>
                    </div>
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
                    <p className="text-sm text-gray-600">Fill out the form with your event and catering details.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Receive a Quote</p>
                    <p className="text-sm text-gray-600">A culinary teacher will review your request and provide a quote.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Finalize & Enjoy</p>
                    <p className="text-sm text-gray-600">Confirm your order, arrange payment, and enjoy your custom event!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <p className="text-sm text-gray-600">
                    Payment can be made via a donation through FutureFund, cash, or check. Details will be provided with your quote.
                  </p>
              </CardContent>
            </Card>
            
            {/* FAQ */}
            <Card>
                <CardHeader>
                    <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-1">What kind of events can you cater?</h4>
                        <p className="text-sm text-gray-600">We can cater a wide range of events, from small department meetings to larger school functions. Just let us know what you need!</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-1">How far in advance should I submit a request?</h4>
                        <p className="text-sm text-gray-600">We recommend submitting requests at least 2-3 weeks in advance, especially for larger events, to ensure we can accommodate you.</p>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}