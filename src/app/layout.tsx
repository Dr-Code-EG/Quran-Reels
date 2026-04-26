import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "QuranReels - إنتاج فيديوهات قرآنية تلقائياً",
  description:
    "أداة مجانية لإنتاج فيديوهات ريلز قرآنية احترافية تلقائياً لكل المنصات - Instagram Reels, TikTok, YouTube Shorts والمزيد",
  keywords: [
    "قرآن",
    "ريلز",
    "فيديو قرآني",
    "إنتاج فيديو",
    "Quran Reels",
    "Islamic video",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
