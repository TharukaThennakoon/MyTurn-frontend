import Link from "next/link";
import BookingConfirmationCard from "@/components/booking/BookingConfirmationCard";

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header
        className="flex items-center justify-between px-6 fixed z-10"
        style={{
          top: 12,
          left: 16,
          right: 16,
          height: 60,
          background: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "blur(14px) saturate(180%)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01)",
          transition: "all 0.3s ease",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", cursor: "pointer" }}>
          <img src="/images/logo.svg" alt="MyTurn Logo" style={{ height: "30px", width: "auto" }} />
          <span className="text-blue-700 font-extrabold text-base tracking-tight">
            My<span className="text-gray-900">Turn</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center pt-24 pb-28 px-4">
        <BookingConfirmationCard />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 px-4">
        {[
          {
            label: "Home",
            icon: (
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            ),
            active: false,
          },
          {
            label: "Bookings",
            icon: (
              <>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </>
            ),
            active: true,
          },
          {
            label: "Nearby",
            icon: (
              <>
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2a10 10 0 010 20A10 10 0 0112 2z" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </>
            ),
            active: false,
          },
          {
            label: "Profile",
            icon: (
              <>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </>
            ),
            active: false,
          },
        ].map(({ label, icon, active }) => (
          <button
            key={label}
            className={`flex flex-col items-center gap-1 transition-colors ${
              active ? "text-blue-700" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={active ? 2.2 : 1.8}
              viewBox="0 0 24 24"
            >
              {icon}
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}