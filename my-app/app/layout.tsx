import type { Metadata } from "next";
import "./globals.css";

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
      data-scroll-behavior="smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      <body>{children}</body>
    </html>
  );
}
