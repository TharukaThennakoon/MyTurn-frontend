export default function VehicleDetails() {
  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="text-sm font-medium mb-2 text-gray-600">
        Vehicle Details
      </h3>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Vehicle Number"
          className="input"
        />

        <select className="input">
          <option>Select Type</option>
          <option>Car</option>
          <option>Bike</option>
        </select>
      </div>
    </div>
  );
}