
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
      <div id="gallery">
      <AutoGallery
        images={[
          "https://i.imghippo.com/files/cfz2963EqA.jpg",
"https://i.imghippo.com/files/oFP4739grs.jpg",
"https://i.imghippo.com/files/gUv4237qyc.jpg",
"https://i.imghippo.com/files/ISz4707xo.jpg",
"https://i.imghippo.com/files/aJQi5028PqM.jpg",
"https://i.imghippo.com/files/HeZ1928bWs.jpg",
        ]}
        images2={[
"https://i.imghippo.com/files/Dxu6079Kug.jpg",
"https://i.imghippo.com/files/yKLP1117lI.jpg",
"https://i.imghippo.com/files/swx2919VVM.jpg",
"https://i.imghippo.com/files/rge3750eXU.jpg",
"https://i.imghippo.com/files/Vei7410cho.jpg",
        ]}
      />
      </div>
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
                and videography services.
              </p>
              <Link href="/contact">
              <Button type="submit" className="my-5 max-w-[15ch] bg-white text-black hover:bg-gray-200 px-8">
                CONTACT US
              </Button>
              </Link>
          
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
