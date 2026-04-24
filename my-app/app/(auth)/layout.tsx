import LeftBanner from "@/components/auth/LeftBanner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br to-white-700 p-6">
      <div className="flex w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden h-[580px]">
        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2">
          <LeftBanner />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
          {children}
        </div>
      </div>
    </div>
  );
}