type NotificationVariant = "urgent" | "confirmed" | "system";

type Props = {
  variant: NotificationVariant;
  title: string;
  message: React.ReactNode;
  time: string;
  isNew?: boolean;
  showActions?: boolean;
};

const iconMap: Record<NotificationVariant, { bg: string; icon: React.ReactNode }> = {
  urgent: {
    bg: "bg-blue-100",
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  confirmed: {
    bg: "bg-green-100",
    icon: (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  system: {
    bg: "bg-orange-100",
    icon: (
      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
};

export default function NotificationCard({ variant, title, message, time, isNew, showActions }: Props) {
  const { bg, icon } = iconMap[variant];

  return (
    <div className={`bg-white rounded-xl p-4 border ${variant === "urgent" ? "border-l-4 border-l-blue-600 border-gray-100" : "border-gray-100"} shadow-sm`}>
      <div className="flex gap-3">
        <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
              {isNew && <span className="w-2 h-2 bg-green-500 rounded-full" />}
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{message}</p>
          {showActions && (
            <div className="flex gap-2 mt-3">
              <button className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
                Check In Now
              </button>
              <button className="border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
                View Map
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}