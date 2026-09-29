import type { Metadata } from "next";
import ServicesClient from "@/components/public/ServicesClient";

export const metadata: Metadata = {
  title: "Our Services | 100% Free Healthcare, Diagnostics & Surgery",
  description:
    "Explore our comprehensive free healthcare services: specialist consultations, free pharmacy, digital X-ray, cataract eye surgery, and rural mobile camps across India.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
