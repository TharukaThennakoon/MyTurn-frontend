import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyTurn — Skip the Wait. Get Your Turn.",
  description:
    "Experience the digital concierge for high-demand services. Secure your spot in real-time and arrive exactly when it's your turn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable}`}
      data-scroll-behavior="smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      <body>{children}</body>
    </html>
  );
}