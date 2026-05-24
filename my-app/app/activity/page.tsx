import ActivityHub from "@/components/activity/ActivityHub";

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-10">
        <span className="text-blue-700 font-bold text-base tracking-tight">
          FuelPass Velocity
        </span>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/thumbs/svg?seed=fuelpass"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="pt-14">
        <ActivityHub />
      </main>
    </div>
  );
}