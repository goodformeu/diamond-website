import type { Metadata } from "next";
import { Inter, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/scroll/SmoothScrollProvider";
import SceneProgressProvider from "@/components/scroll/SceneProgressProvider";
import FloatingNav from "@/components/nav/FloatingNav";
import ProgressIndicator from "@/components/nav/ProgressIndicator";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diamond Coiffures — Barbershop in Purmerend",
  description:
    "Diamond Coiffures is een barbershop in Purmerend. [Volledige beschrijving volgt binnenkort.]",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-paper">
        <SmoothScrollProvider>
          <SceneProgressProvider>
            <FloatingNav />
            <ProgressIndicator />
            <main>{children}</main>
            <Footer />
          </SceneProgressProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
