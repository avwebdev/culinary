import Image from "next/image";
import hero from "@/public/home/hero.png";
import Section1 from "@/public/home/section1.png";

import { Section } from "@/components/Section";
import { InfiniteScrollCarousel } from "@/components/InfinitiveScrollCarousel";

export default function Home() {
  return (
    <div>
      <div className="relative aspect-[9/5] max-h-screen w-full flex items-center justify-center">
        <div className="font-[family-name:var(--font-racing-sans-one)] flex items-center gap-4">
          <p className="text-[11rem] text-saffron-mango-300 shadow-inner">6</p>{" "}
          <p className="text-[6rem] text-ivory-50 -translate-y-5 shadow-inner">
            speed
          </p>
        </div>
        <Image
          src={hero}
          alt="Six Speed Photography Hero"
          className="absolute inset-0 -z-10 w-full max-h-screen object-cover"
        />
      </div>
      <Section
        subtitle="ABOUT"
        title="What is 6 Speed Photography?"
        description="At 6 Speed Photography, based in the Bay Area, CA, we offer top-tier photography and videography services tailored to automotive enthusiasts and event organizers. Our services include car photography, event photography, and graphic design to bring your vision to life. With a passion for detail and a commitment to quality, we're here to make your memories stand out. DM us today for inquiries or to book your session!"
        image={Section1}
      />
      <InfiniteScrollCarousel
        images={[
          "https://dummyimage.com/800x400/ff7f7f/333?text=Slide+1",
          "https://dummyimage.com/800x400/7f7fff/333?text=Slide+2",
          "https://dummyimage.com/800x400/7fff7f/333?text=Slide+3",
          "https://dummyimage.com/800x400/ffff7f/333?text=Slide+4",
        ]}
      />
    </div>
  );
}
