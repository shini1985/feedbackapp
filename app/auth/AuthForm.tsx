"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { LogIn } from "lucide-react"

const TEAL   = "#1aad9f"
const TEAL_D = "#148a7e"
const DARK   = "#1e293b"

export default function AuthForm() {
  const router = useRouter()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push("/admin")
    })
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signErr) { setError(signErr.message); return }
    router.push("/admin")
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", height: "46px", padding: "0 14px",
    border: "1.5px solid #e2e8f0", borderRadius: "10px",
    fontSize: "1rem", outline: "none", fontFamily: "inherit", color: DARK,
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0fafa", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "white", borderRadius: "20px", padding: "44px 36px", boxShadow: "0 20px 60px rgba(26,173,159,0.13)", width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Image src="/logo.png" alt="ESS Logo" width={260} height={70} style={{ objectFit: "contain", margin: "0 auto 20px" }} />
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: DARK, margin: "0 0 4px" }}>Staff Login</h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.88rem" }}>Feedback Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="email" style={{ display: "block", fontWeight: 600, color: DARK, marginBottom: "6px", fontSize: "0.9rem" }}>Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = TEAL)}
              onBlur={e  => (e.currentTarget.style.borderColor = "#e2e8f0")} />
          </div>
          <div>
            <label htmlFor="password" style={{ display: "block", fontWeight: 600, color: DARK, marginBottom: "6px", fontSize: "0.9rem" }}>Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = TEAL)}
              onBlur={e  => (e.currentTarget.style.borderColor = "#e2e8f0")} />
          </div>
          {error && (
            <p style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px", color: "#dc2626", fontSize: "0.88rem", margin: 0 }}>{error}</p>
          )}
          <button type="submit" disabled={loading}
            style={{
              background: loading ? `${TEAL}99` : TEAL, color: "white", border: "none",
              borderRadius: "12px", height: "50px", fontSize: "1rem", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              marginTop: "4px",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = TEAL_D }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = TEAL }}>
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "0.78rem", color: "#94a3b8" }}>
          Authorized staff only. Contact your administrator for access.
        </p>
      </div>
    </div>
  )
}
