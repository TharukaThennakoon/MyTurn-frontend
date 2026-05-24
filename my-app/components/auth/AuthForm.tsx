
import Link from "next/link";
import VehicleDetails from "./VehicleDetails";

type Props = {
  type: "login" | "register";
};

export default function AuthForm({ type }: Props) {
  return (
<div className="w-full max-w-xs">
      <h2 className="text-2xl font-semibold mb-2">
        {type === "register" ? "Create an Account" : "Login"}
      </h2>

      <p className="text-gray-500 mb-6 text-sm">
        Join the elite network of efficient fueling.
      </p>

      <form className="space-y-4">
        {type === "register" && (
          <div>
            <label htmlFor="full-name" className="sr-only">
              Full Name
            </label>
            <input
              id="full-name"
              type="text"
              placeholder="Full Name"
              className="input"
            />
          </div>
        )}

        {/* Phone + Email */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="phone-number" className="sr-only">
              Phone Number
            </label>
            <input
              id="phone-number"
              type="text"
              placeholder="Phone Number"
              className="input"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="email-address" className="sr-only">
              Email Address
            </label>
            <input
              id="email-address"
              type="email"
              placeholder="Email Address"
              className="input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="input"
          />
        </div>

        {type === "register" && <VehicleDetails />}

        <button className="btn-primary">
          {type === "register" ? "Create Account →" : "Login →"}
        </button>

        <p className="text-sm text-center text-gray-500">
          {type === "register"
            ? "Already have an account?"
            : "Don't have an account?"}
          <Link
            href={type === "register" ? "/login" : "/register"}
            className="text-blue-600 ml-1 hover:underline"
          >
            {type === "register" ? "Login here" : "Register here"}
          </Link>
        </p>
      </form>
    </div>
  );
}