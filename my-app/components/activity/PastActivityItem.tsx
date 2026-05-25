type Status = "COMPLETED" | "MISSED";

type Props = {
  date: string;
  status: Status;
  station: string;
  details: string;
  progress: number; // 0–100
};

const statusStyles: Record<Status, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  MISSED: "bg-red-100 text-red-600",
};

export default function PastActivityItem({ date, status, station, details, progress }: Props) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{date}</span>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      <p className="text-sm font-bold text-gray-900 mb-0.5">{station}</p>
      <p className="text-xs text-gray-400 mb-2">{details}</p>

      {status === "COMPLETED" && (
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}