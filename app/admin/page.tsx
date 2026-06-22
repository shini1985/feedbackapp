import { Metadata } from "next"
import AdminDashboard from "./AdminDashboard"

export const metadata: Metadata = {
  title: "Feedback Dashboard | Dubai Medical Fitness Center",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminDashboard />
}
