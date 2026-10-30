import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";

import "@/app/globals.css";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduSense AI",
  description: "Campus AI learning platform with separate student and admin portals.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable} min-h-screen font-sans`}>{children}</body>
    </html>
  );
}
