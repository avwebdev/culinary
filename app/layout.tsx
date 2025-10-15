import type { Metadata } from "next";
import { DM_Sans, Bubblegum_Sans, PT_Serif } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bubblegum = Bubblegum_Sans({
  variable: "--font-bubblegum",
  subsets: ["latin"],
  weight: ["400"],
});

const ptSerif = PT_Serif({
  variable: "--font-ptserif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PUSD Culinary Department",
  description: "Order delicious meals and make reservations at Pleasanton Unified School District's culinary department. Fresh, healthy, and locally sourced ingredients.",
  keywords: ["school lunch", "culinary", "pleasanton", "unified school district", "food service", "cafeteria"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${dmSans.variable} ${bubblegum.variable} ${ptSerif.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}