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
      <div className="mx-[8%] my-12 grid gap-8 min-[950px]:grid-cols-2">
        <div className="flex flex-col mx-8 justify-center">
          <p className="uppercase text-saffron-mango-300 text-2xl">{subtitle}</p>
          <Link href={`#${subtitle.toLowerCase()}`}>
            <h2 className="pb-3 pt-1 text-4xl font-medium hover:text-saffron-mango-50">
              {title}
            </h2>
          </Link>

          {typeof description === "string" ? (
            <p className="prose max-w-none text-pretty text-[20px]">{description}</p>
          ) : (
            <div className="prose max-w-none text-pretty">{description}</div>
          )}
        </div>
        <div className="h-auto flex flex-col mx-8 justify-center">
          <Image
            className={`h-full w-full overflow-hidden rounded-xl object-cover transition delay-150 duration-300 ease-in-out`}
            src={image}
            alt={imageAlt}
            priority
          />
        </div>
      </div>
    </div>
  );
}
