"use client";

export default function BookingActions() {
  return (
    <div className="flex gap-3 mt-5">
      <button
        onClick={() => alert("Added to calendar!")}
        className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-150"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Add to Calendar
      </button>

      <button
        onClick={() => window.print()}
        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:scale-95 text-gray-700 text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-150"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        Save as PDF
      </button>
    </div>
  );
}