export default function VehicleDetails() {
  return (
    <div className="border-t border-gray-100 pt-4 mt-2">
      <h3 className="text-sm font-medium mb-3 text-gray-500 uppercase tracking-wide">
        Vehicle Details
      </h3>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Vehicle Number"
          className="input"
        />

        <select className="input">
          <option value="">Select Type</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="truck">Truck</option>
          <option value="van">Van</option>
        </select>
      </div>
    </div>
  );
}