"use client";

import { useState } from "react";
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
import { Mail, MessageSquare, Send, Instagram, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schoolContacts = [
  {
    name: "Amador Valley High School",
    teacher: "Julia Ford",
    email: "jford@pleasantonusd.net",
    instagram: "AVHS.Culinary",
    instagramLink: "https://www.instagram.com/AVHS.Culinary",
  },
  {
    name: "Foothill High School",
    teacher: "Katrina Wunderlich",
    email: "kwunderlich@pleasantonusd.net",
    instagram: "FHSBakingWunders",
    instagramLink: "https://www.instagram.com/FHSBakingWunders",
  },
  {
    name: "Village High School",
    teacher: "Heather Halliday",
    email: "hhalliday@pleasantonusd.net",
    instagram: null,
    instagramLink: null,
  },
];

const inquiryTypes = [
  { id: "general", name: "General Inquiry" },
  { id: "menu", name: "Menu Questions" },
  { id: "catering", name: "Catering & Custom Events" },
  { id: "feedback", name: "Feedback & Suggestions" },
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
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
        title: "Message Sent!",
        description:
          "Thank you for contacting us. We'll get back to you shortly.",
      });

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
        description:
          "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bubblegum text-slate-900">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions about our program, menus, or catering services? We're
            here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* School Contacts */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bubblegum text-slate-900 mb-4">
                Teacher Contacts
              </h2>
              <div className="space-y-6">
                {schoolContacts.map((school) => (
                  <Card key={school.name} className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <Building className="h-5 w-5 mr-3 text-emerald-600" />
                        {school.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="flex items-center text-sm text-gray-700">
                        <span className="font-medium text-gray-800 w-20">
                          Teacher:
                        </span>
                        {school.teacher}
                      </p>
                      <p className="flex items-center text-sm text-gray-700">
                        <Mail className="h-4 w-4 mr-3 text-emerald-600" />
                        <a
                          href={`mailto:${school.email}`}
                          className="hover:text-emerald-600 break-all"
                        >
                          {school.email}
                        </a>
                      </p>
                      {school.instagram && (
                        <p className="flex items-center text-sm text-gray-700">
                          <Instagram className="h-4 w-4 mr-3 text-emerald-600" />
                          <a
                            href={school.instagramLink!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-600"
                          >
                            @{school.instagram}
                          </a>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <MessageSquare className="h-6 w-6 mr-3 text-emerald-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
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
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiryType">Inquiry Type</Label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, inquiryType: value })
                        }
                      >
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
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
