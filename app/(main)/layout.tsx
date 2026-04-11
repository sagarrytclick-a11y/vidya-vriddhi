import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import MarqueeStrip from "@/components/MarqueeStrip";
import { AdmissionModalProvider } from "@/contexts/admission-modal-context";
import { AdmissionModal } from "@/components/AdmissionModal";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdmissionModalProvider>
      <Navbar />
      {children}
      <Footer />
      <FloatingActions />
      <MarqueeStrip />
      <AdmissionModal />
    </AdmissionModalProvider>
  );
}
