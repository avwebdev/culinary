'use client'
import { Hero } from "@/components/Hero";
import Gallery from "react-photo-gallery";

export default function Contact() {
    const photos = [
        {
          src: "https://images.unsplash.com/photo-1737741276705-569ebd946f5b?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          width: 4,
          height: 3
        },
        {
          src: "https://images.unsplash.com/photo-1737920406899-e1cabc43a6a7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
          width: 1,
          height: 1
        },
        {
          src: "https://plus.unsplash.com/premium_photo-1721597102419-629da328872f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
          width: 3,
          height: 4
        },
        {
          src: "https://images.unsplash.com/photo-1738250733850-1507b75f5e2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8",
          width: 3,
          height: 4
        },
        {
          src: "https://images.unsplash.com/photo-1738275793154-d96539ed1c56?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8",
          width: 3,
          height: 4
        }
    ];

  return (
    <div>
      <Hero />
      <div className="min-h-screen bg-black p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-medium mb-6 text-amber-400">Gallery</h1>
        <Gallery photos={photos} direction={"column"} />;
      </div>
    </div>
    </div>
  );
}
