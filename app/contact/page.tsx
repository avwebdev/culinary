"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    description: "Call us during business hours",
    value: "(925) 462-5500",
    link: "tel:+19254625500",
  },
  {
    icon: Mail,
    title: "Email",
    description: "Send us an email anytime",
    value: "culinary@pleasantonusd.net",
    link: "mailto:culinary@pleasantonusd.net",
  },
  {
    icon: MapPin,
    title: "Address",
    description: "Visit our main office",
    value: "4665 Bernal Ave, Pleasanton, CA 94566",
    link: "https://maps.google.com/?q=4665+Bernal+Ave+Pleasanton+CA+94566",
  },
  {
    icon: Clock,
    title: "Hours",
    description: "Our service hours",
    value: "Mon-Fri: 7:00 AM - 3:00 PM",
    link: null,
  },
];

const schoolLocations = [
  {
    name: "Amador Valley High School",
    address: "1155 Santa Rita Rd, Pleasanton, CA 94566",
    phone: "(925) 462-5500",
    hours: "7:00 AM - 3:00 PM",
  },
  {
    name: "Foothill High School",
    address: "4375 Foothill Rd, Pleasanton, CA 94588",
    phone: "(925) 462-5500",
    hours: "7:00 AM - 3:00 PM",
  },
  {
    name: "Village High School",
    address: "4645 Bernal Ave, Pleasanton, CA 94566",
    phone: "(925) 462-5500",
    hours: "7:00 AM - 3:00 PM",
  },
  {
    name: "Hart Middle School",
    address: "4433 Willow Rd, Pleasanton, CA 94588",
    phone: "(925) 462-5500",
    hours: "7:00 AM - 3:00 PM",
  },
  {
    name: "Pleasanton Middle School",
    address: "5001 Case Ave, Pleasanton, CA 94566",
    phone: "(925) 462-5500",
    hours: "7:00 AM - 3:00 PM",
  },
];

const inquiryTypes = [
  { id: "general", name: "General Inquiry" },
  { id: "menu", name: "Menu Questions" },
  { id: "reservation", name: "Reservation Help" },
  { id: "custom", name: "Custom Request" },
  { id: "feedback", name: "Feedback" },
  { id: "complaint", name: "Complaint" },
  { id: "other", name: "Other" },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would make an API call to send the message
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Have questions about our services, menu, or reservations? We're here to help! 
            Reach out to us through any of the methods below.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method) => (
            <Card key={method.title} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <method.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                {method.link ? (
                  <a
                    href={method.link}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {method.value}
                  </a>
                ) : (
                  <p className="text-gray-900 font-medium">{method.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-emerald-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiryType">Inquiry Type</Label>
                      <Select value={formData.inquiryType} onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Sending Message..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* School Locations */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                  School Locations
                </CardTitle>
                <CardDescription>
                  Find contact information for all our school locations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schoolLocations.map((school) => (
                    <div key={school.name} className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{school.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                          {school.address}
                        </p>
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-emerald-600" />
                          <a href={`tel:${school.phone}`} className="hover:text-emerald-600">
                            {school.phone}
                          </a>
                        </p>
                        <p className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                          {school.hours}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      How do I make a reservation?
                    </h4>
                    <p className="text-sm text-gray-600">
                      You can make reservations through our online reservation system. Visit the Reservations page to book your table.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Can I place orders online?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Yes! Browse our menu and place orders online for pickup or delivery at participating locations.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Do you accommodate dietary restrictions?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Absolutely! We offer various dietary options and can accommodate special requests. Contact us for custom arrangements.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      What are your hours of operation?
                    </h4>
                    <p className="text-sm text-gray-600">
                      We're open Monday through Friday from 7:00 AM to 3:00 PM, and Saturdays from 8:00 AM to 2:00 PM.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Response Time Info */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Quick Response Time</h3>
              </div>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24 hours during business days. 
                For urgent matters, please call us directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
