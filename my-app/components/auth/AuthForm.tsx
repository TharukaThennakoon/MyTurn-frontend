
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
          <input type="text" placeholder="Full Name" className="input" />
        )}

        {/* Phone + Email */}
        <div className="flex gap-2">
          <input type="text" placeholder="Phone Number" className="input" />
          <input type="email" placeholder="Email Address" className="input" />
        </div>

        <input type="password" placeholder="Password" className="input" />

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