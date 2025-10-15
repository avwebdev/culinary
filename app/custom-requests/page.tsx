"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const schools = [
  { id: "1", name: "Amador Valley High School" },
  { id: "2", name: "Foothill High School" },
  { id: "3", name: "Village High School" },
];

export default function CustomRequestsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventDate, setEventDate] = useState<Date>();

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

    if (
      !formData.schoolId ||
      !formData.name ||
      !formData.email ||
      !eventDate ||
      !formData.eventTime ||
      !formData.partySize ||
      !formData.description
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Request Submitted!",
        description: "A culinary teacher will contact you with a quote.",
      });
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
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to submit custom requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Custom Catering Requests
          </h1>
          <p className="text-gray-600">
            Submit a custom request for your special event or dietary needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submit Custom Request</CardTitle>
                <CardDescription>
                  A teacher will contact you with a quote. Payment can be made
                  via FutureFund, cash, or check.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="schoolId">School for Request *</Label>
                    <Select
                      value={formData.schoolId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, schoolId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a school to handle your request" />
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
                    <div>
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="partySize">Number of People *</Label>
                      <Input
                        id="partySize"
                        type="number"
                        value={formData.partySize}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            partySize: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
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
                            {eventDate
                              ? format(eventDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
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
                      <Input
                        id="eventTime"
                        type="time"
                        value={formData.eventTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventTime: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Event Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event, desired menu, and service style."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dietaryRestrictions">
                      Dietary Restrictions
                    </Label>
                    <Textarea
                      id="dietaryRestrictions"
                      placeholder="e.g., Gluten-free, vegetarian, nut allergies."
                      value={formData.dietaryRestrictions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dietaryRestrictions: e.target.value,
                        })
                      }
                      rows={2}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Submit Request</p>
                    <p className="text-sm text-gray-600">
                      Fill out the form with your event details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Receive a Quote</p>
                    <p className="text-sm text-gray-600">
                      A teacher will review and provide a quote.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Finalize & Enjoy</p>
                    <p className="text-sm text-gray-600">
                      Confirm your order and enjoy your custom event!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">What events do you cater?</h4>
                  <p className="text-sm text-gray-600">
                    We cater a range of events, from department meetings to
                    school functions.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">
                    How far in advance should I submit?
                  </h4>
                  <p className="text-sm text-gray-600">
                    We recommend at least 2-3 weeks notice for larger events.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
