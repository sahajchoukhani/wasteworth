import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "WasteWorth — TRASH → TREASURE | Upcycled Luxury & Custom Creations",
  description:
    "WasteWorth transforms discarded plastic bottles, cans, and reusable waste materials into bespoke handcrafted jewellery, accessories, and WasteWorth Form architectural décor.",
  keywords: [
    "WasteWorth",
    "upcycled jewellery",
    "sustainable luxury",
    "recycled plastic accessories",
    "custom waste design",
    "WasteWorth Form",
    "circular design studio",
  ],
  openGraph: {
    title: "WasteWorth — TRASH → TREASURE",
    description:
      "What the world throws away, we turn into worth. Submit your discarded materials and co-create bespoke jewellery or custom architectural décor.",
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
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${spaceMono.variable} h-full`}
    >
      <body className="ww-grain min-h-full flex flex-col bg-ivory text-ink selection:bg-teal-deep selection:text-ivory">
        {children}
      </body>
    </html>
  );
}
