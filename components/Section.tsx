"use client";

import type { StaticImageData } from "next/image";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export type SectionProps = {
  subtitle: string;
  title: string;
  description: string | React.JSX.Element;
  image: string | StaticImageData;
  imageAlt?: string;
};

export function Section({
  subtitle,
  title,
  description,
  image,
  imageAlt = "image",
}: SectionProps) {
  return (
    <div id={subtitle.toLowerCase()}>
      <div className="mx-[8%] my-4 grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col justify-center">
          <p className="uppercase text-saffron-mango-300">{subtitle}</p>
          <Link href={`#${subtitle.toLowerCase()}`}>
            <h2 className="pb-3 pt-1 text-4xl font-medium hover:text-saffron-mango-50">
              {title}
            </h2>
          </Link>

          {typeof description === "string" ? (
            <p className="prose max-w-none text-pretty">{description}</p>
          ) : (
            <div className="prose max-w-none text-pretty">{description}</div>
          )}
        </div>
        <div className="flex justify-center">
          <Image
            className={`my-auto h-72 w-full overflow-hidden rounded-xl object-cover transition delay-150 duration-300 ease-in-out`}
            src={image}
            alt={imageAlt}
            priority
          />
        </div>
      </div>
    </div>
  );
}
