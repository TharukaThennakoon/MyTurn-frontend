import type { Metadata } from "next";
import UserProfile from "@/components/dashboard/profile/UserProfile";

export const metadata: Metadata = {
  title: "Profile — MyTurn",
  description: "Manage your MyTurn profile, vehicles, and account settings.",
};

export default function DashboardProfilePage() {
  return <UserProfile />;
}
