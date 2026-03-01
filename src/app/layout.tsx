import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SlideOutChat } from "@/components/SlideOutChat";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PCSing.us — Your AI-Powered PCS Assistant",
    template: "%s | PCSing.us",
  },
  description:
    "Plan your military PCS move with AI-powered guidance, base information, BAH rates, checklists, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SlideOutChat />
      </body>
    </html>
  );
}
