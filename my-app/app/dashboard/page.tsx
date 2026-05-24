import type { Metadata } from "next";
import UserDashboard from "@/components/dashboard/UserDashboard";

export const metadata: Metadata = {
  title: "Dashboard — MyTurn",
  description: "Your personal MyTurn dashboard. View active appointments, smart station picks, and real-time insights.",
};

export default function DashboardPage() {
  return <UserDashboard />;
}
