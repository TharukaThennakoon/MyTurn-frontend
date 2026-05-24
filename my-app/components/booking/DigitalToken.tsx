type Props = {
  tokenNumber: number;
};

export default function DigitalToken({ tokenNumber }: Props) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 rounded-2xl p-6 text-center mb-4">
      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">
        Your Digital Token
      </p>
      <p className="text-6xl font-black text-blue-700 tracking-tight mb-3">
        #{tokenNumber}
      </p>
      <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        ACTIVE TICKET
      </span>
    </div>
  );
}