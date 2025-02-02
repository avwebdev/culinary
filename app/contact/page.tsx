"use client";

import React, { useState } from "react";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { sendFormData } from "@/lib/email";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false); // ✅ Track form submission

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  
    try {
      const response = await sendFormData(formData);
  
      if (!response.ok) {
        throw new Error("Failed to send form data");
      }
  
      // Reset form fields only if the request was successful
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
  
      // Show confirmation message
      setFormSubmitted(true);
  
      // Hide message after 3 seconds
      setTimeout(() => setFormSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  

  return (
    <div>
      <Hero />
      <div id="contact" className="bg-black p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-medium mb-6 text-amber-400 max-lg:text-center">
            Contact Us
          </h1>

          <div className="mb-8 text-gray-200 space-y-4">
            <p>
              6speed Photography is available to undertake photographic projects in the Bay Area. Contact us here to
              discuss your requirements in more detail.
            </p>

            <div className="space-y-1">
              <p>Location: Pleasanton, CA</p>
              {/* <p>Telephone: idk</p> */}
              <p>Email: 6speedphoto.multimedia@gmail.com</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="firstName"
                placeholder="FIRST NAME"
                className="bg-black border-amber-400 text-white placeholder:text-gray-500"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                placeholder="LAST NAME"
                className="bg-black border-amber-400 text-white placeholder:text-gray-500"
                value={formData.lastName}
                onChange={handleChange}
              />
              
              
            </div>
            <Input
                name="email"
                placeholder="EMAIL"
                type="email"
                className="bg-black border-amber-400 text-white placeholder:text-gray-500"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                name="subject"
                placeholder="SUBJECT"
                className="bg-black border-amber-400 text-white placeholder:text-gray-500"
                value={formData.subject}
                onChange={handleChange}
              />

            <Textarea
              name="message"
              placeholder="MESSAGE"
              className="bg-black border-amber-400 text-white placeholder:text-gray-500 min-h-[120px]"
              value={formData.message}
              onChange={handleChange}
            />

            <div className="flex flex-col max-md:items-center max-w-[100px]">
              <Button type="submit" className="bg-white text-black hover:bg-gray-200 px-8">
                SEND
              </Button>

              {formSubmitted && (
                <p className="mt-2 text-green-400 text-sm">Your message has been sent successfully!</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
