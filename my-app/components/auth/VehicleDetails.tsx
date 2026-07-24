"use client";


interface VehicleDetailsProps {
  vehicleNumber?: string;
  setVehicleNumber?: (val: string) => void;
  vehicleType?: string;
  setVehicleType?: (val: string) => void;
}

export default function VehicleDetails({
  vehicleNumber = "",
  setVehicleNumber,
  vehicleType = "",
  setVehicleType,
}: VehicleDetailsProps) {
  return (
    <div className="border-t border-gray-100 pt-3 mt-1">
      <h3 className="text-xs font-semibold mb-2 text-gray-500 uppercase tracking-wide">
        Vehicle Details
      </h3>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Vehicle Number"
          className="input"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber && setVehicleNumber(e.target.value)}
        />

        <select
          className="input"
          value={vehicleType}
          onChange={(e) => setVehicleType && setVehicleType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="CAR">Car</option>
          <option value="BIKE">Bike</option>
          <option value="TRUCK">Truck</option>
          <option value="VAN">Van</option>
          <option value="THREE_WHEELER">Three Wheeler</option>
        </select>
      </div>
    </div>
  );
}