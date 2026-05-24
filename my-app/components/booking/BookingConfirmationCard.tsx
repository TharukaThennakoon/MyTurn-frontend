import CountdownTimer from "./CountdownTimer";
import DigitalToken from "./DigitalToken";
import BookingActions from "./BookingActions";

type BookingData = {
  tokenNumber: number;
  station: string;
  address: string;
  slot: string;
  arrivalNote: string;
  initialSeconds: number;
};

const BOOKING: BookingData = {
  tokenNumber: 178,
  station: "BlueStar Velocity Hub",
  address: "4th Avenue, Downtown Sector",
  slot: "Today, 14:30 – 15:00",
  arrivalNote: "Arrive 5 mins early",
  initialSeconds: 892, // 14:52
};

export default function BookingConfirmationCard() {
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Success header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed</h1>
        <p className="text-sm text-gray-400 mt-1">
          Show your token at the station arrival point.
        </p>
      </div>

      {/* Token */}
      <DigitalToken tokenNumber={BOOKING.tokenNumber} />

      {/* Detail card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex gap-4">
          {/* QR Code */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-28 h-28 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              {/* QR placeholder — swap with a real QR library if needed */}
              <svg viewBox="0 0 100 100" className="w-24 h-24 text-gray-800" fill="currentColor">
                {/* Top-left finder */}
                <rect x="10" y="10" width="30" height="30" rx="4" />
                <rect x="15" y="15" width="20" height="20" rx="2" fill="white" />
                <rect x="19" y="19" width="12" height="12" rx="1" />
                {/* Top-right finder */}
                <rect x="60" y="10" width="30" height="30" rx="4" />
                <rect x="65" y="15" width="20" height="20" rx="2" fill="white" />
                <rect x="69" y="19" width="12" height="12" rx="1" />
                {/* Bottom-left finder */}
                <rect x="10" y="60" width="30" height="30" rx="4" />
                <rect x="15" y="65" width="20" height="20" rx="2" fill="white" />
                <rect x="19" y="69" width="12" height="12" rx="1" />
                {/* Data dots */}
                <rect x="50" y="50" width="6" height="6" />
                <rect x="60" y="50" width="6" height="6" />
                <rect x="70" y="50" width="6" height="6" />
                <rect x="50" y="60" width="6" height="6" />
                <rect x="70" y="60" width="6" height="6" />
                <rect x="60" y="70" width="6" height="6" />
                <rect x="80" y="70" width="6" height="6" />
                <rect x="80" y="50" width="6" height="6" />
                <rect x="50" y="80" width="6" height="6" />
                <rect x="70" y="80" width="6" height="6" />
                <rect x="80" y="80" width="6" height="6" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">SCAN TO CHECK-IN</p>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between">
            <CountdownTimer initialSeconds={BOOKING.initialSeconds} />

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Station</p>
                  <p className="text-xs font-semibold text-gray-800">{BOOKING.station}</p>
                  <p className="text-xs text-gray-400">{BOOKING.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Scheduled Slot</p>
                  <p className="text-xs font-semibold text-gray-800">{BOOKING.slot}</p>
                  <p className="text-xs text-gray-400">{BOOKING.arrivalNote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BookingActions />
      </div>

      {/* Notice */}
      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs text-amber-700 leading-relaxed">
          Please ensure you have your mobile app open at the entry gate. Your token
          will expire if you do not arrive within your time slot.
        </p>
      </div>
    </div>
  );
}