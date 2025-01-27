"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

export type GalleryProps = {
  images: (string | StaticImageData)[];
};

export function Gallery({ images }: GalleryProps) {
  const [hoveredIndices, setHoveredIndices] = useState<[number | null, number | null]>([null, null]);

  const handleMouseEnter = (rowIndex: number, imageIndex: number) => {
    setHoveredIndices((prev) => {
      const newIndices = [...prev] as [number | null, number | null];
      newIndices[rowIndex] = imageIndex;
      return newIndices;
    });
  };

  const handleMouseLeave = (rowIndex: number) => {
    setHoveredIndices((prev) => {
      const newIndices = [...prev] as [number | null, number | null];
      newIndices[rowIndex] = null;
      return newIndices;
    });
  };

  return (
    <div className="overflow-hidden">
      {[0, 1].map((rowIndex) => (
        <div
          key={rowIndex}
          className={`flex ${rowIndex === 0 ? "animate-bannermove" : "animate-bannermove-reverse"} hover:pause-animation`}
          onMouseLeave={() => handleMouseLeave(rowIndex)}
        >
          {[...images, ...images].map((src, imageIndex) => (
            <div
              key={imageIndex}
              className="flex-none w-1/4 p-2"
              onMouseEnter={() => handleMouseEnter(rowIndex, imageIndex)}
            >
              <Image
                src={src || "/placeholder.svg"}
                alt={`Gallery image ${imageIndex + 1}`}
                width={300}
                height={200}
                className={`transition-all duration-300 ${
                  hoveredIndices[rowIndex] !== null && hoveredIndices[rowIndex] !== imageIndex ? "brightness-50" : ""
                }`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
