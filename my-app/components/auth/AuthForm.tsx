"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VehicleDetails from "./VehicleDetails";
import { authService } from "@/services";

type Props = {
  type: "login" | "register";
};

export default function AuthForm({ type }: Props) {
  const router = useRouter();
  const isRegister = type === "register";

  const [fullName, setFullName] = useState("");
  const [nic, setNic] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      if (!fullName.trim()) {
        setError("Full Name is required.");
        return;
      }
      if (!nic.trim()) {
        setError("NIC Card Number is required.");
        return;
      }
      if (!phone.trim() || !email.trim()) {
        setError("Phone number and Email address are required.");
        return;
      }
      if (!password) {
        setError("Password is required.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      try {
        setLoading(true);
        const res = await authService.userRegister({
          fullName,
          name: fullName,
          nic,
          phone,
          email,
          password,
          confirmPassword,
          vehicleNumber,
          vehicleType,
        });

        if (res.success) {
          router.push("/login");
        } else {
          setError(res.message || "Registration failed. Please try again.");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong during registration.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password) {
        setError("Email and Password are required.");
        return;
      }

      try {
        setLoading(true);
        const res = await authService.userLogin({
          email,
          password,
        });

        const token = res.data?.accessToken || res.data?.token;

        if (res.success) {
          if (token) {
            localStorage.setItem("token", token);
          }
          // Save real user details from backend for dashboard display
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: res.data?.name || res.data?.fullName || email.split("@")[0],
              email: res.data?.email || email,
              phone: res.data?.phone || "",
              vehicleId: res.data?.vehicleId || null,
              vehicleNumber: res.data?.vehicleNumber || "",
            })
          );
          router.push("/dashboard");
        } else {
          setError(res.message || "Login failed. Please check credentials.");
        }
      } catch (err: any) {
        setError(err.message || "Invalid email or password.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-xs">
      {/* Header */}
      <div className="mb-5">
        <h2 className="mb-1 text-2xl font-bold text-gray-900">
          {isRegister ? "Create an Account" : "Welcome back"}
        </h2>
        <p className="text-sm text-gray-500">
          {isRegister
            ? "Join the elite network of efficient fueling."
            : "Sign in to manage your queue and bookings."}
        </p>
      </div>

      {/* Error notification */}
      {error && (
        <div className="mb-3 p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={isRegister}
            />
          </div>
        )}

        {/* NIC Card Number — register only */}
        {isRegister && (
          <div>
            <label htmlFor="nic-number" className="sr-only">
              NIC Card Number
            </label>
            <input
              id="nic-number"
              type="text"
              placeholder="NIC Card Number"
              className="input"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              required={isRegister}
            />
          </div>
        )}

        {/* Phone (register only) + Email */}
        {isRegister ? (
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={isRegister}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email Address
            </label>
            <input
              id="email-address"
              type="email"
              placeholder="Email Address"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password — register only */}
        {isRegister && (
          <div>
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={isRegister}
            />
          </div>
        )}

        {/* Vehicle details — register only */}
        {isRegister && (
          <VehicleDetails
            vehicleNumber={vehicleNumber}
            setVehicleNumber={setVehicleNumber}
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : isRegister
              ? "Create Account →"
              : "Login →"}
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