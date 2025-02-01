import Image from "next/image";
import Section1 from "@/public/home/section1.png";
import ContactImage from "@/public/home/contact.png";

import { Hero } from "@/components/Hero";

import { Section } from "@/components/Section";
import { AutoGallery } from "@/components/AutoGallery";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Hero />
      <Section
        subtitle="ABOUT"
        title="What is 6 Speed Photography?"
        description="At 6 Speed Photography, based in the Bay Area, CA, we offer top-tier photography and videography services tailored to automotive enthusiasts and event organizers. Our services include car photography, event photography, and graphic design to bring your vision to life. With a passion for detail and a commitment to quality, we're here to make your memories stand out. DM us today for inquiries or to book your session!"
        image={Section1}
      />
      <AutoGallery
        images={[
          "https://dummyimage.com/800x400/ff7f7f/333?text=Slide+1",
          "https://dummyimage.com/800x400/7f7fff/333?text=Slide+2",
          "https://dummyimage.com/800x400/7fff7f/333?text=Slide+3",
          "https://dummyimage.com/800x400/ffff7f/333?text=Slide+4",
        ]}
      />
      <div className="w-full relative max-w-none h-[500px]" style={{
        aspectRatio: ContactImage.width / ContactImage.height,
      }}>
        <div className="mx-[8%] flex flex-col justify-center h-full">
          <div className="flex flex-col mx-8 justify-center">
            
              <p className="uppercase text-saffron-mango-300 text-lg">Contact</p>
              <Link href="/contact">
                <h2 className="pb-3 pt-1 text-4xl font-medium hover:text-saffron-mango-50">
                  Let&apos;s work together
                </h2>
              </Link>
            

              <p className="prose max-w-[25ch] text-pretty text-[20px]">
                We&apos;ll help you reach your goals with our top-tier photography
                and videography services
              </p>
              <Button type="submit" className="my-5 max-w-[15ch] bg-white text-black hover:bg-gray-200 px-8">
                CONTACT US
              </Button>
          
            <Image
              src={ContactImage}
              alt="Contact Image"
              className="absolute inset-0 -z-10 object-cover w-full h-full"
            />
          </div>
        </div>
      </div>


    </div>
  );
}
