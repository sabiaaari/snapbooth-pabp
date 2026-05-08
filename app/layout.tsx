import type { Metadata } from "next";
import { Pacifico, Bitter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const scriptFont = Pacifico({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
});

const serifFont = Bitter({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapBooth | Web Photobooth",
  description: "Bikin momen makin seru dengan frame kustom kamu!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${scriptFont.variable} ${serifFont.variable} h-full antialiased`}>
      <body className="min-h-screen bg-[#FDF2F2] font-serif text-[#5D0E11]">
        <Navbar />
        <main className="pt-32 pb-20">{children}</main>
      </body>
    </html>
  );
}
