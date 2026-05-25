"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import VehicleDetails from "./VehicleDetails";

type Props = {
  type: "login" | "register";
};

export default function AuthForm({ type }: Props) {
  const isRegister = type === "register";

  return (
    <div className="w-full max-w-xs">
      {/* Header */}
      <div className="mb-6">
        <h2 className="mb-1 text-2xl font-bold text-gray-900">
          {isRegister ? "Create an Account" : "Welcome back"}
        </h2>
        <p className="text-sm text-gray-500">
          {isRegister
            ? "Join the elite network of efficient fueling."
            : "Sign in to manage your queue and bookings."}
        </p>
      </div>

      <form className="space-y-3">
        {/* Full Name — register only */}
        {isRegister && (
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
              type="tel"
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

        {/* Password */}
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

        {/* Vehicle details — register only */}
        {isRegister && <VehicleDetails />}

        {/* Submit */}
        <button type="submit" className="btn-primary">
          {isRegister ? "Create Account →" : "Login →"}
        </button>

        {/* Footer link */}
        <p className="pt-1 text-sm text-center text-gray-500">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="ml-1 font-medium text-blue-600 hover:underline"
          >
            {isRegister ? "Login here" : "Register here"}
          </Link>
        </p>
      </form>
    </div>
  );
}