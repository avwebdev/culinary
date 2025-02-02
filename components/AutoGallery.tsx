"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { motion } from "framer-motion";

export type AutoGalleryProps = {
  images: (string | StaticImageData)[];
  images2: (string | StaticImageData)[];
};

export function AutoGallery({ images, images2 }: AutoGalleryProps) {
  return (
    <div className="overflow-hidden">
      <div className="flex hover:pause-animation">
        {[...images, ...images].map((_, index) => (
          <motion.div
            key={`motion-1-${index}`} // ✅ Unique key for motion div
            className="flex w-max space-x-4"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ ease: "linear", duration: 100, repeat: Infinity }}
          >
            {images.concat(images).map((src, imgIndex) => ( // Duplicate for smooth looping
              <div
                key={`img-1-${index}-${imgIndex}`} // ✅ Unique key for each image
                className="w-[450px] h-[300px] max-[700px]:w-[300px] max-[700px]:h-[200px] flex-none w-1/10 p-2 overflow-hidden"
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Gallery image ${imgIndex + 1}`}
                  width={600}
                  height={400}
                  className="object-cover object-center transition-all duration-100 rounded-lg"
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="flex hover:pause-animation">
        {[...images2, ...images2].map((_, index) => (
          <motion.div
            key={`motion-2-${index}`} // ✅ Unique key for motion div
            className="flex w-max space-x-4"
            animate={{ x: ["-100%", "0%"] }}
            transition={{ ease: "linear", duration: 100, repeat: Infinity }}
          >
            {images2.concat(images2).map((src, imgIndex) => ( // Duplicate for smooth looping
              <div
                key={`img-2-${index}-${imgIndex}`} // ✅ Unique key for each image
                className="center-crop w-[450px] h-[300px] max-[700px]:w-[300px] max-[700px]:h-[200px] flex items-center justify-center w-1/10 p-2 overflow-hidden rounded-lg"
                style={{ clipPath: "inset(0 round 8px)" }}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Gallery image ${imgIndex + 1}`}
                  width={600}
                  height={400}
                  className="object-cover object-center transition-all duration-100 rounded-lg"
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
