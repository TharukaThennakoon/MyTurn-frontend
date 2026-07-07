export default function LeftBanner() {
  return (
    <div
      className="w-full h-full bg-cover bg-center relative text-white"
      style={{ backgroundImage: "url('/images/landing.png')" }}
    >
      {/* Fallback gradient in case image doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col justify-center px-12">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">
            ⛽
          </div>
          <span className="text-2xl font-bold tracking-wide">MyTurn</span>
        </div>

        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Fuel Access,<br />Without the Wait.
        </h1>

        <p className="mb-8 text-blue-100 text-sm leading-relaxed">
          Digital queueing designed for the modern driver. Skip the line, arrive on time.
        </p>

        <div className="space-y-3">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-xl flex items-center gap-3 text-sm">
            <span className="text-green-300 font-bold">✔</span>
            Real-time queue updates
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-xl flex items-center gap-3 text-sm">
            <span className="text-green-300 font-bold">✔</span>
            Priority booking slots
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-xl flex items-center gap-3 text-sm">
            <span className="text-green-300 font-bold">✔</span>
            SMS &amp; push notifications
          </div>
        </div>
      </div>
    </div>
  );
}