import { Metadata } from "next"
import AuthForm from "./AuthForm"

export const metadata: Metadata = {
  title: "Staff Login | Dubai Medical Fitness Center",
  robots: { index: false, follow: false },
}

export default function AuthPage() {
  return <AuthForm />
}
