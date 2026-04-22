export default function LeftBanner() {
  return (
    <div
      className="w-full h-full bg-cover bg-center relative text-white"
      style={{ backgroundImage: "url('/images/fuel-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-blue-900/80 flex flex-col justify-center px-12">
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