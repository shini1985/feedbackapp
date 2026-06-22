import { Metadata } from "next"
import FeedbackForm from "./FeedbackForm"

export const metadata: Metadata = {
  title: "Feedback | Dubai Medical Fitness Center",
  robots: { index: false },
}

export default function FeedbackPage() {
  return <FeedbackForm />
}
