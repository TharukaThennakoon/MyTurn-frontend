export default function LeftBanner() {
  return (
    <div
      className="w-full h-full bg-cover bg-center relative text-white"
      style={{ backgroundImage: "url('/images/landing.png')" }}
    >
      <div className="absolute inset-0 bg-blue-900/80 flex flex-col justify-center px-12">
        {/* Brand Icon and Name */}
        <div className="flex items-center gap-2 mb-8">
          <img src="https://p7.hiclipart.com/preview/451/559/633/computer-icons-gasoline-fuel-dispenser-filling-station-vector-png-gas.jpg" alt="Fuel Icon" className="w-8 h-8" />
          <span className="text-2xl font-bold tracking-wide">MyTurn</span>
        </div>

        <h1 className="text-4xl font-bold mb-4">
          Fuel Access, Without the Wait.
        </h1>

        <p className="mb-6">
          Digital queueing designed for the modern driver.
        </p>

        <div className="space-y-3">
          <div className="bg-white/10 p-3 rounded-lg">
            ✔ Real-time updates
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            ✔ Priority booking
          </div>
        </div>
      </div>
    </div>
  );
}