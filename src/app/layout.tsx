import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Aayu Sanjeevni — Free Healthcare for All",
    template: "%s | Aayu Sanjeevni",
  },
  description:
    "Aayu Sanjeevni is an NGO providing underprivileged individuals with free, top-tier medical diagnoses, medicines, and treatment from renowned doctors. Zero financial or administrative burden.",
  keywords: [
    "NGO",
    "healthcare",
    "free medical",
    "diagnosis",
    "charity",
    "medical camp",
    "Aayu Sanjeevni",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Aayu Sanjeevni",
    title: "Aayu Sanjeevni — Free Healthcare for All",
    description:
      "Providing underprivileged individuals with free, top-tier medical diagnoses and treatment.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aayu Sanjeevni — Free Healthcare for All",
    description:
      "Providing underprivileged individuals with free, top-tier medical diagnoses and treatment.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
