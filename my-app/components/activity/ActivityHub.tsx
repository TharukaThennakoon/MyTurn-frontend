import NotificationCard from "./NotificationCard";
import PastActivityItem from "./PastActivityItem";

const NOTIFICATIONS = [
  {
    id: 1,
    variant: "urgent" as const,
    title: "Your turn is near",
    message: (
      <>
        You are #3 in queue at{" "}
        <span className="text-blue-600 font-semibold">Shell Velocity Hub</span>.
        {" "}Please arrive within 10 minutes.
      </>
    ),
    time: "Just now",
    isNew: true,
    showActions: true,
  },
  {
    id: 2,
    variant: "confirmed" as const,
    title: "Booking Confirmed",
    message: (
      <>
        Confirmed for 18:30 at{" "}
        <span className="font-semibold text-gray-700">TotalEnergies Prime</span>.
        {" "}Refueling Bay #4 reserved.
      </>
    ),
    time: "2h ago",
    isNew: false,
    showActions: false,
  },
  {
    id: 3,
    variant: "system" as const,
    title: "System Update",
    message:
      "Scheduled maintenance on April 24th may affect real-time queue visibility between 02:00 and 04:00 AM.",
    time: "Yesterday",
    isNew: false,
    showActions: false,
  },
];

const PAST_ACTIVITY = [
  {
    id: 1,
    date: "OCT 12, 2023",
    status: "COMPLETED" as const,
    station: "Engen High-Flow Station",
    details: "15.4 Gallons • $64.20 • 14:15 PM",
    progress: 85,
  },
  {
    id: 2,
    date: "OCT 08, 2023",
    status: "MISSED" as const,
    station: "FuelPass Express Zone",
    details: "Arrival window expired • 09:45 AM",
    progress: 0,
  },
  {
    id: 3,
    date: "OCT 01, 2023",
    status: "COMPLETED" as const,
    station: "Shell Velocity Hub",
    details: "12.1 Gallons • $52.80 • 18:30 PM",
    progress: 65,
  },
];

export default function ActivityHub() {
  const newCount = NOTIFICATIONS.filter((n) => n.isNew).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 mb-1">Activity Hub</h1>
        <p className="text-sm text-gray-400">
          Manage your refueling queue status and review past performance.
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* LEFT — Notifications */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide">
              Priority Notifications
            </h2>
            {newCount > 0 && (
              <span className="bg-blue-700 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {newCount} New
              </span>
            )}
          </div>

          <div className="space-y-3">
            {NOTIFICATIONS.map((n) => (
              <NotificationCard key={n.id} {...n} />
            ))}
          </div>
        </div>

        {/* RIGHT — Past Activity */}
        <div className="w-72 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Past Activity</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">
              View All
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5">
            {PAST_ACTIVITY.map((a) => (
              <PastActivityItem key={a.id} {...a} />
            ))}
          </div>

          {/* Monthly Efficiency card */}
          <div className="mt-4 bg-blue-700 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">Monthly Efficiency</p>
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <p className="text-5xl font-black mb-2">94%</p>
            <p className="text-xs text-blue-200 leading-relaxed">
              You've saved 4.2 hours in queues this month compared to average users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}