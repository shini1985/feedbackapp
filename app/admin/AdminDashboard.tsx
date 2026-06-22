"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { LogOut, Star, RefreshCw } from "lucide-react"

type Feedback = {
  id: string
  name: string | null
  service_type: string
  overall_rating: number
  improvement_areas: string[] | null
  comments: string | null
  would_recommend: boolean | null
  created_at: string
}

const deptLabels: Record<string, string> = {
  medical_typing:   "Medical Typing",
  ded:              "DED",
  amer:             "Amer",
  tasheel:          "Tasheel",
  it:               "IT",
  accounts:         "Accounts",
  operations:       "Operations",
  dept_supervisors: "Dept. Supervisors",
}

const deptColors: Record<string, { bg: string; text: string }> = {
  medical_typing:   { bg: "#dcfce7", text: "#15803d" },
  ded:              { bg: "#dbeafe", text: "#1d4ed8" },
  amer:             { bg: "#fef3c7", text: "#92400e" },
  tasheel:          { bg: "#ede9fe", text: "#6d28d9" },
  it:               { bg: "#f0f9ff", text: "#0369a1" },
  accounts:         { bg: "#fff7ed", text: "#c2410c" },
  operations:       { bg: "#fdf4ff", text: "#86198f" },
  dept_supervisors: { bg: "#f1f5f9", text: "#334155" },
}

const areaLabels: Record<string, string> = {
  staff: "Staff Behavior", waiting: "Waiting Time", cleanliness: "Cleanliness",
  process: "Process", communication: "Communication", facilities: "Facilities", other: "Other",
}

const TEAL = "#1aad9f"
const TEAL_D = "#148a7e"
const DARK = "#1e293b"

export default function AdminDashboard() {
  const router = useRouter()
  const [items, setItems] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterDept, setFilterDept] = useState<string>("all")

  const load = async () => {
    setLoading(true); setError("")
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push("/auth"); return }
      const res = await fetch("/api/admin/feedback", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.status === 401 || res.status === 403) { router.push("/auth"); return }
      if (!res.ok) throw new Error("Failed to load feedback")
      setItems(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feedback")
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const signOut = async () => { await supabase.auth.signOut(); router.push("/auth") }

  const filtered = filterDept === "all" ? items : items.filter(i => i.service_type === filterDept)

  const stats = {
    total: filtered.length,
    avgRating: filtered.length > 0
      ? (filtered.reduce((s, i) => s + i.overall_rating, 0) / filtered.length).toFixed(2) : "—",
    recommend: filtered.filter(i => i.would_recommend).length,
  }

  const btnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "8px 14px", border: "1.5px solid #e2e8f0",
    borderRadius: "8px", background: "white", color: DARK,
    fontSize: "0.88rem", fontWeight: 500, cursor: "pointer",
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #e2e8f0", background: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <Image src="/logo.png" alt="ESS Logo" width={220} height={60} style={{ objectFit: "contain" }} />
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={load} style={btnStyle}><RefreshCw size={15} /> Refresh</button>
            <button onClick={signOut} style={btnStyle}><LogOut size={15} /> Sign out</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 20px" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: DARK, marginBottom: "20px" }}>Feedback Dashboard</h1>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Responses", value: stats.total, accent: TEAL },
            { label: "Average Rating", value: `${stats.avgRating} / 5`, accent: "#f59e0b" },
            { label: "Would Recommend", value: `${stats.recommend} / ${stats.total}`, accent: "#22c55e" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.accent}` }}>
              <p style={{ margin: "0 0 4px", fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: "2rem", fontWeight: 700, color: DARK }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Department filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {["all", ...Object.keys(deptLabels)].map((d) => {
            const active = filterDept === d
            return (
              <button key={d} onClick={() => setFilterDept(d)}
                style={{
                  padding: "6px 14px", borderRadius: "20px", fontSize: "0.84rem", fontWeight: 600,
                  border: `1.5px solid ${active ? TEAL : "#e2e8f0"}`,
                  background: active ? TEAL : "white",
                  color: active ? "white" : DARK, cursor: "pointer",
                }}>
                {d === "all" ? "All Departments" : deptLabels[d]}
              </button>
            )
          })}
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "16px", color: "#dc2626", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "48px" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: "14px", padding: "48px", textAlign: "center", color: "#64748b" }}>
            No feedback submissions yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((f) => {
              const dc = deptColors[f.service_type] || { bg: "#f1f5f9", text: "#334155" }
              return (
                <div key={f.id} style={{ background: "white", borderRadius: "14px", padding: "18px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 700, color: DARK }}>{f.name || "Anonymous"}</span>
                      <span style={{ background: dc.bg, color: dc.text, borderRadius: "20px", padding: "3px 12px", fontSize: "0.78rem", fontWeight: 600 }}>
                        {deptLabels[f.service_type] || f.service_type}
                      </span>
                      <div style={{ display: "flex", gap: "3px" }}>
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={15} style={{ color: "#f59e0b" }} fill={s <= f.overall_rating ? "#f59e0b" : "none"} />
                        ))}
                      </div>
                      {f.would_recommend === true  && <span style={{ background: "#dcfce7", color: "#15803d", borderRadius: "20px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 600 }}>👍 Recommends</span>}
                      {f.would_recommend === false && <span style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: "20px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 600 }}>👎 Does not</span>}
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "#94a3b8", whiteSpace: "nowrap" }}>
                      {new Date(f.created_at).toLocaleString()}
                    </span>
                  </div>

                  {f.improvement_areas && f.improvement_areas.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                      {f.improvement_areas.map((a) => (
                        <span key={a} style={{ background: "#fef3c7", color: "#92400e", borderRadius: "6px", padding: "2px 8px", fontSize: "0.76rem", fontWeight: 500 }}>
                          {areaLabels[a] || a}
                        </span>
                      ))}
                    </div>
                  )}

                  {f.comments && <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569" }}>{f.comments}</p>}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
