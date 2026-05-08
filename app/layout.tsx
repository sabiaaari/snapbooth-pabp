import type { Metadata } from "next";
import { Pacifico, Bitter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const logoFont = Pacifico({
  weight: "400",
  variable: "--font-logo",
  subsets: ["latin"],
});

const headingFont = Bricolage_Grotesque({
  variable: "--font-heading",
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
    <html lang="en" className={`${logoFont.variable} ${headingFont.variable} ${serifFont.variable} h-full antialiased`}>
      <body className="min-h-screen bg-y2k-bg font-serif text-y2k-primary">
        <Navbar />
        <main className="pt-32 pb-20">{children}</main>
      </body>
    </html>
  );
}
