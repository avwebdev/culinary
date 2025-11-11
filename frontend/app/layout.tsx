import type { Metadata } from "next";
import { Bubblegum_Sans } from "next/font/google";

import { Navbar } from "@/components/Navbar";

import "./globals.css";

const bubblegum = Bubblegum_Sans({
  variable: "--font-bubblegum",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "PUSD Culinary Department",
  description: "Culinary excellence in education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bubblegum.variable} ${bubblegum.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
