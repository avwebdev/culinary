"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMediaUrl } from "@/lib/cms/strapi";
import { useCart } from "@/hooks/useCart";
import { ShoppingCartIcon } from "lucide-react";

type CMSImageFormat = {
  url: string;
  width: number;
  height: number;
  name: string;
};

type CMSImage = {
  url: string;
  alternativeText: string | null;
  formats?: Partial<
    Record<"thumbnail" | "small" | "medium" | "large", CMSImageFormat>
  >;
};

type MenuItem = {
  id: number;
  name: string;
  seasonal: boolean;
  availableUntil: string | null;
  ingredients: string[];
  price: number;
  school: string;
  slug: string;
  image?: CMSImage | null;
};

function formatPrice(value: number) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MenuGrid({
  school,
  items,
}: {
  school: string;
  items: MenuItem[];
}) {
  const { add } = useCart();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Menu</h1>
          <p className="text-muted-foreground">at {school}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {items?.length ?? 0} items
          </Badge>
        </div>
      </div>

      {!items?.length ? (
        <div className="rounded-2xl border p-8 text-center text-muted-foreground">
          No menu items found for <span className="font-medium">{school}</span>.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const src = item.image?.url
              ? getMediaUrl(item.image.url)
              : undefined;
            const alt = item.image?.alternativeText ?? item.name;

            return (
              <Card
                key={item.id}
                className="pt-0 overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-4/3">
                  {src ? (
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-sm text-muted-foreground">
                        No image
                      </span>
                    </div>
                  )}
                </div>

                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl leading-tight">
                      {item.name}
                    </CardTitle>
                    <div className="shrink-0 text-right text-lg font-medium">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {item.seasonal && (
                      <Badge variant="secondary">Seasonal</Badge>
                    )}
                    {item.availableUntil && (
                      <Badge variant="outline">
                        Until {formatDate(item.availableUntil)}
                      </Badge>
                    )}
                    <Badge variant="outline" className="max-w-56 truncate">
                      {item.school}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Ingredients
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients?.map((ing) => (
                      <Badge
                        key={ing}
                        variant={ing == "Nuts" ? "destructive" : "outline"}
                        className="capitalize"
                      >
                        {ing}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="justify-end">
                  <Button className="cursor-pointer" onClick={() => add(item.slug)}><ShoppingCartIcon /> Add to cart</Button>
                  {/* If you want a details page, use next/link with item.slug */}
                  {/* <Link href={`/menu/${item.slug}`} className="text-sm underline underline-offset-4">View details</Link> */}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
