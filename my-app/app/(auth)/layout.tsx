import LeftBanner from "@/components/auth/LeftBanner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2">
        <LeftBanner />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        {children}
      </div>
    </div>
  );
}