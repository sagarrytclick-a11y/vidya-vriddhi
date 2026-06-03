import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import MarqueeStrip from "@/components/MarqueeStrip";
import { AdmissionModalProvider } from "@/contexts/admission-modal-context";
import { AdmissionModal } from "@/components/AdmissionModal";
import { VVSaarthiProvider } from "@/contexts/vv-saarthi-context";
import { VVSaarthiSidebar } from "@/components/VVSaarthiSidebar";
import { VVSaarthiFloatingButton } from "@/components/VVSaarthiFloatingButton";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdmissionModalProvider>
      <VVSaarthiProvider>
        <Navbar />
        <div className="pt-28">
          {children}
        </div>
        <Footer />
        <FloatingActions />
        <MarqueeStrip />
        <AdmissionModal />
        <VVSaarthiSidebar />
        <VVSaarthiFloatingButton />
      </VVSaarthiProvider>
    </AdmissionModalProvider>
  );
}
