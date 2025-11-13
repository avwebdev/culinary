"use client";

import * as React from "react";
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
import { getMediaUrl } from "@/lib/cms/strapi";

export default function RecentWork({ images }) {
  const urls = images.map((img) => getMediaUrl(img.url));

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
                <UrlCard url={url} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3" />
          <CarouselNext className="-right-3" />
        </Carousel>
      </section>

      {/* Plain grid list of the same URLs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {urls.map((url, idx) => (
          <UrlCard key={`grid-${idx}`} url={url} />
        ))}
      </section>
    </div>
  );
}

function UrlCard({ url }: { url: string }) {
  return (
    <Card className="h-full border-muted/60">
      <CardHeader className="pb-2">
        <CardTitle className="truncate text-base">{url}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={url} target="_blank" rel="noopener noreferrer">
            Open
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
