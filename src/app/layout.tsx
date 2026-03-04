import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SlideOutChat } from "@/components/SlideOutChat";
import { AuthProvider } from "@/context/AuthContext";
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "PCSing.us",
      url: "https://pcsing.us",
      description:
        "AI-powered military relocation assistant for PCS moves",
      audience: {
        "@type": "Audience",
        audienceType: "US Military Service Members and Families",
      },
    },
    {
      "@type": "WebSite",
      name: "PCSing.us",
      url: "https://pcsing.us",
      description:
        "Plan your military PCS move with AI-powered guidance, base information, BAH rates, checklists, and more.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://pcsing.us/bases?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <SlideOutChat />
        </AuthProvider>
      </body>
    </html>
  );
}
