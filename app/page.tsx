import Image from "next/image";
import hero from "@/public/home/hero.png";
import Section1 from "@/public/home/section1.png"

import { Section } from "@/components/Section";

export default function Home() {
  return (
    <div>
      <div className="relative aspect-[9/5] w-full flex items-center justify-center">
        <div className="font-[family-name:var(--font-racing-sans-one)] flex items-center gap-4">
          <p className="text-[11rem] text-[#f6bd4d] shadow-inner">6</p> <p className="text-[6rem] text-[#FCFDEE] -translate-y-5 shadow-inner">speed</p>
        </div>
        <Image src={hero} alt="Six Speed Photography Hero" className="absolute inset-0 -z-10" />
      </div>
      <Section title="ABOUT" headline="What is 6 Speed Photography?" description="At 6 Speed Photography, based in the Bay Area, CA, we offer top-tier photography and videography services tailored to automotive enthusiasts and event organizers. Our services include car photography, event photography, and graphic design to bring your vision to life. With a passion for detail and a commitment to quality, we're here to make your memories stand out. DM us today for inquiries or to book your session!" image={Section1} />
    </div>
  );
}
