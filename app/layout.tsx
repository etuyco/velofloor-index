import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  // Load as a variable font with the optical-sizing axis (like the original
  // Google Fonts CDN). This gives the high-contrast display look at large
  // sizes; weights (incl. font-black/900) come from the variable wght axis.
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Velofloor | Secure Your Digital Headquarters",
  description:
    "Bring the energy of the office to your remote team. Join the Velofloor waitlist. Launching June 15, 2026.",
  authors: [{ name: "Velofloor Inc." }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body selection:bg-brand-emerald selection:text-white flex flex-col min-h-screen relative grid-bg">
        {children}
      </body>
    </html>
  );
}
