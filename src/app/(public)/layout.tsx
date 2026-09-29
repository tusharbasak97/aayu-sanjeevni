import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import EmergencyBar from "@/components/public/EmergencyBar";
import TranslationWatcher from "@/components/public/TranslationWatcher";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TranslationWatcher />
      <Navbar />
      <main className="public-main-content">{children}</main>
      <Footer />
      <ScrollToTop />
      <EmergencyBar />
    </>
  );
}
