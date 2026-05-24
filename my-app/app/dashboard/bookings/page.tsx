import type { Metadata } from "next";
import BookingFlow from "@/components/dashboard/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Slot — MyTurn",
  description:
    "Select a station, choose fuel, pick a time slot, and confirm your MyTurn booking.",
};

export default function DashboardBookingsPage() {
  return <BookingFlow />;
}
