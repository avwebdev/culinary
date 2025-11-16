"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getMediaUrl } from "@/lib/cms/utils";

import type { components } from "@/lib/cms/types";
import Image from "next/image";

type BlockRecentWorkType = components["schemas"]["BlocksRecentWorkComponent"];

export default function RecentWork({ images }: BlockRecentWorkType) {
  if (!images) {
    return null;
  }

  const urls = images.map((img) => (img.url ? getMediaUrl(img.url) : "#"));

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <h1 className="text-3xl font-semibold tracking-tight">Recent Work</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Just links. Click to open.
      </p>

      {/* Simple carousel of URLs */}
      <section className="mb-8">
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent>
            {urls.map((url, idx) => (
              <CarouselItem
                key={`${url}-${idx}`}
                className="basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full border-muted/60">
                  <CardHeader className="pb-2">
                    <Image
                      src={url}
                      alt="Recent Work Image"
                      width={400}
                      height={300}
                      className="rounded-md object-cover aspect-3/2"
                    />
                    <CardTitle className="truncate text-base">{url}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3" />
          <CarouselNext className="-right-3" />
        </Carousel>
      </section>
    </div>
  );
}
