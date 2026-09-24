import { CyberToaster } from "@shared/toasts";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import StoreMaintenanceCartel from "@/components/StoreMaintenanceCartel";
import WhatsAppFloat from "@/components/WhatsappFloat";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.inmortalgaming.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Inmortal Gaming — Bienes Digitales",
    template: "%s | Inmortal Gaming",
  },
  description:
    "Monedas virtuales, gift cards, ítems de videojuegos y servicios digitales. Paga vía WhatsApp, recibe al instante.",
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
  openGraph: {
    title: "Inmortal Gaming — Bienes Digitales",
    description:
      "Bienes digitales para tu juego — monedas, gift cards, ítems y servicios.",
    siteName: "Inmortal Gaming",
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inmortal Gaming — Bienes Digitales",
    description:
      "Bienes digitales para tu juego — monedas, gift cards, ítems y servicios.",
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "zz1ByuEpfPq2PMDnz33zgsPK4f3UWP6kbKWzfuwp6oE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased bg-bg-primary text-text-primary font-body">
        <AuthProvider>
          <CartProvider>
            <StoreMaintenanceCartel />
            <Navbar />

            {children}
            <Footer />
            <CyberToaster />
          </CartProvider>
          <WhatsAppFloat />
        </AuthProvider>
      </body>
    </html>
  );
}
