"use client"

import { useState } from "react"
import Image from "next/image"

type Lang = "en" | "ar"

const TEAL = "#1aad9f"
const TEAL_D = "#148a7e"

const depts = [
  { id: "medical_typing",   en: "Medical Typing",    ar: "الكتابة الطبية",     icon: "🩺", bg: "#E1F5EE", fg: "#0F6E56" },
  { id: "ded",              en: "DED",               ar: "التنمية الاقتصادية", icon: "🏛️",  bg: "#E6F1FB", fg: "#185FA5" },
  { id: "amer",             en: "Amer",              ar: "أمر",               icon: "🛂", bg: "#EEEDFE", fg: "#534AB7" },
  { id: "tasheel",          en: "Tasheel",           ar: "تسهيل",              icon: "📋", bg: "#FAEEDA", fg: "#854F0B" },
  { id: "it",               en: "IT",                ar: "تقنية المعلومات",    icon: "💻", bg: "#DBEAFE", fg: "#1d4ed8" },
  { id: "accounts",         en: "Accounts",          ar: "الحسابات",           icon: "📊", bg: "#EAF3DE", fg: "#3B6D11" },
  { id: "operations",       en: "Operations",        ar: "العمليات",           icon: "⚙️", bg: "#FAECE7", fg: "#993C1D" },
  { id: "dept_supervisors", en: "Dept. Supervisors", ar: "مشرفو الأقسام",     icon: "👔", bg: "#F1EFE8", fg: "#5F5E5A" },
]

const improvementIds = ["staff","waiting","cleanliness","process","communication","facilities","other"] as const

const t = {
  en: {
    tagline: "Emirates Secretarial Services", sub: "Emirates Karama Business Center",
    deptQ: "Which department did you visit today?",
    ratingQ: "How would you rate your overall experience?",
    rate: ["Very Dissatisfied","Dissatisfied","Neutral","Satisfied","Very Satisfied"],
    improveQ: "Areas we can improve",
    areas: { staff:"Staff Behavior", waiting:"Waiting Time", cleanliness:"Cleanliness", process:"Process / Steps", communication:"Communication", facilities:"Facilities", other:"Other" },
    recommendQ: "Would you recommend our services?",
    yes: "Yes", no: "No",
    nameLabel: "Your Name (optional)", namePh: "Enter your name",
    submit: "Submit Feedback", submitting: "Submitting…",
    requiredErr: "Please select a department, rating and recommendation.",
    thanks: "Thank You!", thanksMsg: "Your feedback helps us improve our services.",
    another: "Submit Another Response", langBtn: "العربية",
  },
  ar: {
    tagline: "الإمارات لخدمات رجال الأعمال", sub: "مركز الكرامة للأعمال",
    deptQ: "أي قسم زرته اليوم؟",
    ratingQ: "كيف تقيّم تجربتك العامة؟",
    rate: ["غير راضٍ جداً","غير راضٍ","محايد","راضٍ","راضٍ جداً"],
    improveQ: "المجالات التي يمكننا تحسينها",
    areas: { staff:"سلوك الموظفين", waiting:"وقت الانتظار", cleanliness:"النظافة", process:"الإجراءات", communication:"التواصل", facilities:"المرافق", other:"أخرى" },
    recommendQ: "هل توصي بخدماتنا؟",
    yes: "نعم", no: "لا",
    nameLabel: "اسمك (اختياري)", namePh: "أدخل اسمك",
    submit: "إرسال التقييم", submitting: "جاري الإرسال…",
    requiredErr: "يرجى اختيار القسم والتقييم والتوصية.",
    thanks: "شكراً لك!", thanksMsg: "ملاحظاتك تساعدنا على تحسين خدماتنا.",
    another: "تقديم إجابة أخرى", langBtn: "English",
  },
} as const

export default function FeedbackForm() {
  const [lang, setLang]           = useState<Lang>("en")
  const [step, setStep]           = useState<"form"|"success">("form")
  const [dept, setDept]           = useState<string|null>(null)
  const [rating, setRating]       = useState<number|null>(null)
  const [areas, setAreas]         = useState<string[]>([])
  const [recommend, setRecommend] = useState<boolean|null>(null)
  const [name, setName]           = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState("")

  const L   = t[lang]
  const rtl = lang === "ar"
  const dir: "rtl"|"ltr" = rtl ? "rtl" : "ltr"

  const toggleArea = (id: string) =>
    setAreas(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!dept || rating === null || recommend === null) { setError(L.requiredErr); return }
    setSubmitting(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, serviceType: dept, overallRating: rating, improvementAreas: areas, comments: "", wouldRecommend: recommend }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Error")
      setStep("success")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
    } finally { setSubmitting(false) }
  }

  const reset = () => {
    setDept(null); setRating(null); setAreas([])
    setRecommend(null); setName(""); setError(""); setStep("form")
  }

  /* ── Success ── */
  if (step === "success") return (
    <div dir={dir} style={{ minHeight:"100vh", background:"#f0fafa", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"white", borderRadius:20, padding:"48px 32px", textAlign:"center", boxShadow:"0 20px 60px rgba(26,173,159,0.12)", maxWidth:520, width:"100%" }}>
        <Image src="/logo.png" alt="ESS" width={260} height={70} style={{ objectFit:"contain", marginBottom:28 }} />
        <div style={{ width:96, height:96, borderRadius:"50%", background:TEAL, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:42, color:"white" }}>✓</div>
        <h2 style={{ fontSize:28, fontWeight:700, color:"#1e293b", marginBottom:12 }}>{L.thanks}</h2>
        <p style={{ fontSize:15, color:"#64748b", marginBottom:36, lineHeight:1.6 }}>{L.thanksMsg}</p>
        <button onClick={reset} style={{ background:TEAL, color:"white", border:"none", borderRadius:12, padding:"14px 32px", fontSize:15, fontWeight:700, cursor:"pointer" }}>
          🔄 {L.another}
        </button>
      </div>
    </div>
  )

  /* ── Form ── */
  return (
    <div dir={dir} style={{ minHeight:"100vh", background:"#f0fafa", padding:"20px 16px 48px" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>

        {/* Lang + Header */}
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            style={{ padding:"7px 14px", border:`1.5px solid ${TEAL}`, borderRadius:8, background:"white", color:TEAL, fontSize:13, fontWeight:600, cursor:"pointer" }}>
            🌐 {L.langBtn}
          </button>
        </div>

        <div style={{ background:"white", borderRadius:16, padding:"20px 28px", boxShadow:"0 4px 20px rgba(26,173,159,0.1)", marginBottom:20, textAlign:"center" }}>
          <Image src="/logo.png" alt="ESS" width={300} height={76} style={{ objectFit:"contain" }} />
          <p style={{ margin:"10px 0 0", fontSize:13, color:"#64748b" }}>Customer Feedback · استمارة تقييم العملاء</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background:"white", borderRadius:20, border:`1.5px solid ${TEAL}22`, boxShadow:"0 8px 32px rgba(26,173,159,0.08)", padding:"clamp(20px,4vw,40px)" }}>

            {/* ── Department ── */}
            <section style={{ marginBottom:36 }}>
              <h2 style={{ fontSize:"clamp(1.1rem,3vw,1.4rem)", fontWeight:700, color:"#1e293b", marginBottom:16, marginTop:0, textAlign:rtl?"right":"left" }}>{L.deptQ}</h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
                {depts.map(d => {
                  const sel = dept === d.id
                  return (
                    <label key={d.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"16px 8px 14px", borderRadius:14, border:`${sel?2.5:1.5}px solid ${sel?d.fg:"#e2e8f0"}`, background:sel?d.bg:"white", cursor:"pointer", position:"relative", transition:"all 0.15s" }}>
                      <input type="radio" name="dept" value={d.id} checked={sel} onChange={() => setDept(d.id)} style={{ position:"absolute", opacity:0, width:0, height:0 }} />
                      {sel && <div style={{ position:"absolute", top:6, right:6, width:18, height:18, background:d.fg, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"white", fontWeight:700 }}>✓</div>}
                      <div style={{ width:44, height:44, background:sel?"white":d.bg, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{d.icon}</div>
                      <span style={{ fontSize:12, fontWeight:700, color:sel?d.fg:"#334155", textAlign:"center", lineHeight:1.25 }}>{rtl?d.ar:d.en}</span>
                      <span style={{ fontSize:10, color:"#94a3b8", textAlign:"center", direction:rtl?"ltr":"rtl" }}>{rtl?d.en:d.ar}</span>
                    </label>
                  )
                })}
              </div>
            </section>

            <hr style={{ border:"none", borderTop:"1px solid #f1f5f9", margin:"0 0 32px" }} />

            {/* ── Rating ── */}
            <section style={{ marginBottom:36 }}>
              <h2 style={{ fontSize:"clamp(1.1rem,3vw,1.4rem)", fontWeight:700, color:"#1e293b", marginBottom:16, marginTop:0, textAlign:rtl?"right":"left" }}>{L.ratingQ}</h2>
              <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
                {[1,2,3,4,5].map(s => {
                  const lit = rating !== null && s <= rating
                  return (
                    <label key={s} style={{ display:"flex", alignItems:"center", justifyContent:"center", width:64, height:64, borderRadius:"50%", border:`2.5px solid ${lit?TEAL:"#e2e8f0"}`, background:lit?TEAL:"white", color:lit?"white":"#cbd5e1", fontSize:28, cursor:"pointer" }}>
                      <input type="radio" name="rating" value={s} checked={rating===s} onChange={() => setRating(s)} style={{ position:"absolute", opacity:0, width:0, height:0 }} />
                      ★
                    </label>
                  )
                })}
              </div>
              {rating && <p style={{ textAlign:"center", marginTop:10, fontSize:14, color:TEAL, fontWeight:600 }}>{L.rate[rating-1]}</p>}
            </section>

            <hr style={{ border:"none", borderTop:"1px solid #f1f5f9", margin:"0 0 32px" }} />

            {/* ── Improvement areas ── */}
            <section style={{ marginBottom:36 }}>
              <h2 style={{ fontSize:"clamp(1.1rem,3vw,1.4rem)", fontWeight:700, color:"#1e293b", marginBottom:16, marginTop:0, textAlign:rtl?"right":"left" }}>{L.improveQ}</h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:10 }}>
                {improvementIds.map(id => {
                  const on = areas.includes(id)
                  return (
                    <label key={id} style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 14px", borderRadius:12, border:`${on?2:1.5}px solid ${on?TEAL:"#e2e8f0"}`, background:on?`${TEAL}10`:"white", cursor:"pointer" }}>
                      <input type="checkbox" checked={on} onChange={() => toggleArea(id)} style={{ position:"absolute", opacity:0, width:0, height:0 }} />
                      <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${on?TEAL:"#cbd5e1"}`, background:on?TEAL:"white", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, color:"white" }}>{on?"✓":""}</div>
                      <span style={{ fontSize:13, fontWeight:500, color:"#1e293b" }}>{L.areas[id]}</span>
                    </label>
                  )
                })}
              </div>
            </section>

            <hr style={{ border:"none", borderTop:"1px solid #f1f5f9", margin:"0 0 32px" }} />

            {/* ── Recommend ── */}
            <section style={{ marginBottom:36 }}>
              <h2 style={{ fontSize:"clamp(1.1rem,3vw,1.4rem)", fontWeight:700, color:"#1e293b", marginBottom:16, marginTop:0, textAlign:rtl?"right":"left" }}>{L.recommendQ}</h2>
              <div style={{ display:"flex", gap:14 }}>
                {([true,false] as const).map(val => {
                  const sel = recommend === val
                  const col = val ? "#16a34a" : "#dc2626"
                  return (
                    <label key={String(val)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"18px", borderRadius:14, border:`${sel?2.5:1.5}px solid ${sel?col:"#e2e8f0"}`, background:sel?(val?"#f0fdf4":"#fef2f2"):"white", cursor:"pointer", fontSize:16, fontWeight:700, color:sel?col:"#1e293b" }}>
                      <input type="radio" name="recommend" checked={recommend===val} onChange={() => setRecommend(val)} style={{ position:"absolute", opacity:0, width:0, height:0 }} />
                      {val?"👍":"👎"} {val?L.yes:L.no}
                    </label>
                  )
                })}
              </div>
            </section>

            <hr style={{ border:"none", borderTop:"1px solid #f1f5f9", margin:"0 0 32px" }} />

            {/* ── Name ── */}
            <section style={{ marginBottom:32 }}>
              <label style={{ display:"block", fontSize:14, fontWeight:600, color:"#1e293b", marginBottom:8, textAlign:rtl?"right":"left" }}>{L.nameLabel}</label>
              <input
                type="text"
                placeholder={L.namePh}
                value={name}
                onChange={e => setName(e.target.value)}
                dir={dir}
                style={{ width:"100%", height:50, padding:"0 16px", border:"1.5px solid #e2e8f0", borderRadius:11, fontSize:15, outline:"none", fontFamily:"inherit", color:"#1e293b" }}
                onFocus={e => (e.currentTarget.style.borderColor = TEAL)}
                onBlur={e  => (e.currentTarget.style.borderColor = "#e2e8f0")}
              />
            </section>

            {error && (
              <p style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"13px 16px", color:"#dc2626", textAlign:"center", fontSize:14, marginBottom:20 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{ width:"100%", padding:"18px", background:submitting?`${TEAL}77`:TEAL, color:"white", border:"none", borderRadius:13, fontSize:16, fontWeight:700, cursor:submitting?"not-allowed":"pointer" }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = TEAL_D }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = TEAL }}>
              ✉️  {submitting ? L.submitting : L.submit}
            </button>

          </div>
        </form>

        <p style={{ textAlign:"center", marginTop:20, color:"#94a3b8", fontSize:12 }}>
          © Emirates Secretarial Services · Emirates Karama Business Center
        </p>
      </div>
    </div>
  )
}
