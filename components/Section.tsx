"use client";

import type { StaticImageData } from "next/image";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export function Section({
  title,
  headline,
  description,
  image,
  imageAlt = "image",
  direction = "left",
  id = "",
  url = "#",
}: {
  title: string;
  headline: string;
  description: string | React.JSX.Element;
  image: string | StaticImageData;
  imageAlt?: string;
  direction?: "left" | "right";
  id?: string;
  url?: string;
}) {
  const textSection = (
    <div className="flex flex-col justify-center" id={id}>
      <Link
        href={url}
        className="pb-3 pt-2 text-3.5xl font-bold text-racing-green-900 hover:text-racing-green-800"
      >
        {headline}
      </Link>

      {typeof description === "string" ? (
        <p className="prose max-w-none text-pretty text-racing-green-950">
          {description}
        </p>
      ) : (
        <div className="prose max-w-none text-pretty text-racing-green-950">
          {description}
        </div>
      )}
    </div>
  );

  const imageSection = (
    <div className="flex justify-center">
      <Image
        className={`my-auto h-72 w-full overflow-hidden rounded-xl border-4 border-racing-green-600 object-cover transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105`}
        src={image}
        alt={imageAlt}
        priority
      />
    </div>
  );

  return (
    <div id={id}>
      <div className="mx-[8%] my-4 grid gap-8 sm:hidden">
        {textSection}
        {imageSection}
      </div>
      <div
        className={`hidden grid-cols-2 sm:grid ${
          direction === "left" ? "gap-8" : "gap-8 xl:gap-10 2xl:gap-12"
        } mx-[8%] my-4`}
      >
        {direction === "left" ? textSection : imageSection}
        {direction === "left" ? imageSection : textSection}
      </div>
    </div>
  );
}
