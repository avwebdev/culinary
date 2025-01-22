"use client";

import React from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";

interface InfiniteScrollCarouselProps {
  images: string[];
}

const InfiniteScrollCarousel: React.FC<InfiniteScrollCarouselProps> = ({
  images,
}) => {
//   const [emblaRef] = useEmblaCarousel({ loop: true }, [
//     Autoplay({
//       delay: 300,
//       stopOnInteraction: false,
//       stopOnMouseEnter: true,
//     }),
//   ]);

  return (
    <div className="relative h-[350px] overflow-hidden">
      <div className="absolute top-0 left-0 overflow-hidden whitespace-nowrap animate-bannermove">
        <img
          src="https://i.sstatic.net/xckZy.jpg"
          alt=""
          className="mx-2"
        />
        <img
          src="https://i.sstatic.net/CVgbr.jpg"
          alt=""
          className="mx-2"
        />
        <img
          src="https://i.sstatic.net/7c4yC.jpg"
          alt=""
          className="mx-2"
        />
        <img
          src="https://i.sstatic.net/RTiml.jpg"
          alt=""
          className="mx-2"
        />
      </div>
    </div>
  );
};

export { InfiniteScrollCarousel };
