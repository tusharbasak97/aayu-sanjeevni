import type { Metadata } from "next";
import AboutClient from "@/components/public/AboutClient";

export const metadata: Metadata = {
  title: "About Us | Aayu Sanjeevni - Free Healthcare for India",
  description:
    "Learn about Aayu Sanjeevni's mission to provide 100% free healthcare, surgeries, and medicines to underprivileged communities across India.",
};

export default function AboutPage() {
  return <AboutClient />;
}
