"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Check,
  ChevronsUpDown,
  ArrowRight,
  ArrowRightIcon,
  UtensilsIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getMediaUrl } from "@/lib/cms/strapi";

type School = { name: string; slug: string };
export default function SchoolPicker({ schools }: { schools: School[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<School | null>(null);

  const handleSelect = (slug: string) => {
    const school = schools.find((s) => s.slug === slug) || null;
    setSelected(school);
    setOpen(false);
  };

  return (
    <div>
      <Card className="border-none shadow-sm max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-primary/10 p-3">
              <GraduationCap className="size-6 text-primary" />
            </div>
            <CardTitle className="text-2xl pt-2.5">
              Find A School's Menu
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="grow justify-between"
                  aria-label="Open school search"
                >
                  {selected ? selected.name : "Search and select a school..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput placeholder="Type to search schools..." />
                  <CommandList>
                    <CommandEmpty>No schools found.</CommandEmpty>
                    <CommandGroup>
                      {schools.map((s) => (
                        <CommandItem
                          key={s.slug}
                          value={s.slug}
                          onSelect={handleSelect}
                          className="cursor-pointer"
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selected?.slug === s.slug
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {s.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              className="shrink-0 cursor-pointer"
              variant="default"
              onClick={() => selected && router.push(`/menu/${selected.slug}`)}
              disabled={!selected}
            >
              View menu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 pt-5 text-center">
        {schools.map((school, i) => (
          <Link key={i} href={`/menu/${school.name.replaceAll(" ", "-")}`} className="group grow">
            <Card className="!pt-0 shadow-sm transition-all duration-300 h-full flex flex-col">
              <div className="overflow-hidden relative h-56 w-full hover:shadow-xl">
                <Image
                  src={getMediaUrl(school.hero.url)}
                  alt={`${school.name} food`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-ptSerif text-slate-900 group-hover:text-[--accent] transition-colors">
                  {school.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between grow">
                <div className="flex items-center text-primary font-semibold">
                  <span>View Menu</span>
                  <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
                <UtensilsIcon className="h-8 w-8 text-gray-300 group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
