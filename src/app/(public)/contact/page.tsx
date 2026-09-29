import type { Metadata } from "next";
import ContactClient from "@/components/public/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us & 24x7 Helpline | Aayu Sanjeevni",
  description:
    "Reach out to Aayu Sanjeevni for free medical assistance, emergency surgeries, volunteering opportunities, or toll-free helpline support.",
};

export default function ContactPage() {
  return <ContactClient />;
}
