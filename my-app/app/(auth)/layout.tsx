"use client";

import LeftBanner from "@/components/auth/LeftBanner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br to-white">
      <div className="flex w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden h-[580px]">
        {/* LEFT SIDE */}
        <div className="hidden w-1/2 md:flex">
          <LeftBanner />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center w-full p-8 bg-white md:w-1/2">
          {children}
        </div>
      </div>
    </div>
  );
}