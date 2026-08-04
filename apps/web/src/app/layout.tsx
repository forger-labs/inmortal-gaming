import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

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

export const metadata: Metadata = {
  title: "Inmortal Gaming — Bienes Digitales",
  description:
    "Monedas virtuales, gift cards, ítems de videojuegos y servicios digitales. Paga vía WhatsApp, recibe al instante.",
  openGraph: {
    title: "Inmortal Gaming",
    description:
      "Bienes digitales para tu juego — monedas, gift cards, ítems y servicios.",
    siteName: "Inmortal Gaming",
    locale: "es_VE",
    type: "website",
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
        <Navbar />

        {children}
        <Footer />
      </body>
    </html>
  );
}
