"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data - in real app this would come from the database
const schools = [
  { id: "1", name: "Amador Valley High School", address: "1155 Santa Rita Rd, Pleasanton, CA 94566" },
  { id: "2", name: "Foothill High School", address: "4375 Foothill Rd, Pleasanton, CA 94588" },
  { id: "3", name: "Village High School", address: "4645 Bernal Ave, Pleasanton, CA 94566" },
  { id: "4", name: "Hart Middle School", address: "4433 Willow Rd, Pleasanton, CA 94588" },
  { id: "5", name: "Pleasanton Middle School", address: "5001 Case Ave, Pleasanton, CA 94566" },
];

const timeSlots = [
  { id: "breakfast", name: "Breakfast", time: "7:00 AM - 9:00 AM" },
  { id: "lunch", name: "Lunch", time: "11:00 AM - 2:00 PM" },
  { id: "dinner", name: "Dinner", time: "5:00 PM - 8:00 PM" },
];

export default function ReservationsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [partySize, setPartySize] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSchool || !selectedDate || !selectedTime || !partySize) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would make an API call to create the reservation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Reservation Confirmed!",
        description: `Your reservation for ${partySize} people on ${format(selectedDate, 'PPP')} at ${timeSlots.find(t => t.id === selectedTime)?.name} has been confirmed.`,
      });

      // Reset form
      setSelectedSchool("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setPartySize("");
      setSpecialRequests("");
    } catch {
      toast({
        title: "Reservation Failed",
        description: "There was an error creating your reservation. Please try again.",
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
              Please sign in to make reservations.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white">
              <a href="/auth/signin">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Make a Reservation</h1>
                          <p className="text-gray-700">
            Reserve your table for a delightful dining experience at any of our school locations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reservation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Details</CardTitle>
                <CardDescription>
                  Fill in the details below to make your reservation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* School Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="school">Select School *</Label>
                    <Select value={selectedSchool} onValueChange={setSelectedSchool}>
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

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Select Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="time">Select Time *</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            <div className="flex items-center justify-between">
                              <span>{slot.name}</span>
                              <span className="text-sm text-gray-500">{slot.time}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Party Size */}
                  <div className="space-y-2">
                    <Label htmlFor="partySize">Number of Guests *</Label>
                    <Select value={partySize} onValueChange={setPartySize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select party size" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} {size === 1 ? 'person' : 'people'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      placeholder="Any special dietary requirements, accessibility needs, or other requests..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Reservation..." : "Confirm Reservation"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            {/* Reservation Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Reservation Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Breakfast</span>
                  <span className="text-gray-600">7:00 AM - 9:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Lunch</span>
                  <span className="text-gray-600">11:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dinner</span>
                  <span className="text-gray-600">5:00 PM - 8:00 PM</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500">
                    Reservations are available Monday through Saturday. 
                    Sunday service is not available.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Reservation Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Reservations are held for 15 minutes past the scheduled time
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Cancellations must be made at least 2 hours in advance
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Maximum party size is 10 people
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Special dietary requests should be noted in advance
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Have questions about your reservation or need to make changes?
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
