import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createServerSupabase } from "@/lib/supabase-server"

const schema = z.object({
  name: z.string().trim().max(100).optional(),
  serviceType: z.string().min(1).max(60),   // department id
  overallRating: z.number().int().min(1).max(5),
  improvementAreas: z.array(z.string()).default([]),
  comments: z.string().trim().max(1000).optional(),
  wouldRecommend: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const supabase = createServerSupabase()

    const { error } = await supabase.from("feedback_submissions").insert({
      name: data.name || null,
      service_type: data.serviceType,
      overall_rating: data.overallRating,
      improvement_areas: data.improvementAreas,
      comments: data.comments || null,
      would_recommend: data.wouldRecommend ?? null,
    })

    if (error) {
      console.error("Feedback error:", error)
      return NextResponse.json({ error: "Failed to submit feedback." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
}
