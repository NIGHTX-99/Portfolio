import type { Metadata } from "next";
import { Bebas_Neue, Dancing_Script } from "next/font/google";

import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Aashutosh Chaudhary",
  description: "Portfolio of Aashutosh Chaudhary",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dancingScript.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
