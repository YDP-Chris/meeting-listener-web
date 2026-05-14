"use client";
import { useState } from "react";

const palettes = {
  A: {
    name: "Electric Blue",
    sub: "Monochrome + single accent. Linear/Vercel/Raycast aesthetic.",
    bg: "#0c0c0e", surface: "#151519", border: "#25252c",
    accent: "#3b82f6", accentLight: "#609cff", accentDim: "#3b82f620",
    text: "#f5f5f8", gray: "#8c8c99", dim: "#595963",
    green: "#3cc77c", amber: "#f5b838", red: "#f05454",
  },
  B: {
    name: "Midnight Teal",
    sub: "Deep navy + teal. Sophisticated, calm, trustworthy. Stripe/Notion feel.",
    bg: "#0a0f1a", surface: "#111a2e", border: "#1e2d4a",
    accent: "#14b8a6", accentLight: "#2dd4bf", accentDim: "#14b8a620",
    text: "#eef2f7", gray: "#8899aa", dim: "#556677",
    green: "#34d399", amber: "#fbbf24", red: "#f87171",
  },
  C: {
    name: "Warm Slate + Gold",
    sub: "Premium executive coaching. Charcoal + gold. Luxury consulting feel.",
    bg: "#111113", surface: "#1a1a1e", border: "#2a2a30",
    accent: "#d4a853", accentLight: "#e8c171", accentDim: "#d4a85320",
    text: "#f0ece4", gray: "#9a9590", dim: "#5e5a55",
    green: "#6bc77c", amber: "#d4a853", red: "#e86b5a",
  },
};

type PaletteKey = keyof typeof palettes;

const dims = [
  { name: "Active Listening", score: 9 },
  { name: "Clarity", score: 8 },
  { name: "Follow-through", score: 8 },
  { name: "Influence", score: 7 },
  { name: "Assertiveness", score: 6 },
  { name: "Conciseness", score: 5 },
];

function scoreColor(score: number, p: typeof palettes.A) {
  if (score >= 8) return p.green;
  if (score >= 6) return p.amber;
  return p.red;
}

function Logo({ p, size = 28 }: { p: typeof palettes.A; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Mic body */}
      <rect x="12" y="4" width="8" height="14" rx="4" fill={p.accent} />
      {/* Mic arc */}
      <path d="M8 16v2a8 8 0 0 0 16 0v-2" stroke={p.accent} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Stand */}
      <line x1="16" y1="26" x2="16" y2="29" stroke={p.accent} strokeWidth="2" strokeLinecap="round" />
      {/* Pulse waves */}
      <path d="M24 10c2 1 3 3 3 6s-1 5-3 6" stroke={p.accentLight} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M27 8c2.5 2 4 5 4 8s-1.5 6-4 8" stroke={p.accentLight} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
    </svg>
  );
}

function DemoCard({ paletteKey, p }: { paletteKey: string; p: typeof palettes.A }) {
  return (
    <div style={{ background: p.bg, borderRadius: 16, overflow: "hidden", border: `1px solid ${p.border}` }}>
      {/* Nav */}
      <div style={{ background: p.surface, borderBottom: `1px solid ${p.border}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo p={p} size={24} />
          <span style={{ color: p.text, fontWeight: 700, fontSize: 15 }}>Meeting<span style={{ color: p.accent }}>IQ</span></span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
          {["Home", "Meetings", "People", "Dashboard"].map((s, i) => (
            <span key={s} style={{ color: i === 0 ? p.text : p.dim, fontWeight: i === 0 ? 600 : 400, borderBottom: i === 0 ? `2px solid ${p.accent}` : "none", paddingBottom: 2 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* IQ Score Hero */}
        <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 24, gridColumn: "1 / -1", display: "flex", gap: 40, alignItems: "center" }}>
          {/* Ring */}
          <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
            <svg width={120} height={120} viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke={p.border} strokeWidth="5" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={p.accent} strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 52 * 0.72} ${2 * Math.PI * 52 * 0.28}`}
                strokeLinecap="round" transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dasharray 1s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: p.text, fontSize: 32, fontWeight: 800, lineHeight: 1 }}>72</span>
              <span style={{ color: p.dim, fontSize: 8, letterSpacing: 2, fontWeight: 600, marginTop: 4 }}>IQ SCORE</span>
            </div>
          </div>
          {/* Dims */}
          <div style={{ flex: 1 }}>
            <div style={{ color: p.text, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Communication Intelligence</div>
            <div style={{ color: p.dim, fontSize: 11, marginBottom: 16 }}>1 meeting analyzed</div>
            {dims.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ color: p.gray, fontSize: 11, width: 110 }}>{d.name}</span>
                <div style={{ flex: 1, height: 3, background: p.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${d.score * 10}%`, height: "100%", background: scoreColor(d.score, p), borderRadius: 2, transition: "width 0.8s ease" }} />
                </div>
                <span style={{ color: scoreColor(d.score, p), fontSize: 12, fontWeight: 700, width: 20, textAlign: "right" }}>{d.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coaching */}
        <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 20, borderLeft: `3px solid ${p.accent}` }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: p.accent, letterSpacing: 1.5, marginBottom: 8 }}>COACHING</div>
          <div style={{ color: p.text, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Work on conciseness</div>
          <div style={{ color: p.gray, fontSize: 12, lineHeight: 1.6 }}>
            Lead with your conclusion first. Support with 1-2 key points only when asked.
          </div>
          <div style={{ color: p.dim, fontSize: 10, marginTop: 12 }}>From: Intro with Vic</div>
        </div>

        {/* Stats + Streak */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Streak */}
          <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🔥</span>
            <div>
              <span style={{ color: p.text, fontSize: 24, fontWeight: 800 }}>1</span>
              <span style={{ color: p.gray, fontSize: 12, marginLeft: 8 }}>meeting streak</span>
            </div>
          </div>
          {/* Mini stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["1", "MEETINGS", p.accent], ["4", "ACTIONS", p.amber], ["1", "PEOPLE", p.text], ["7.2", "AVG", p.text]].map(([v, l, c]) => (
              <div key={l as string} style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ color: c as string, fontSize: 20, fontWeight: 800 }}>{v}</div>
                <div style={{ color: p.dim, fontSize: 8, fontWeight: 600, letterSpacing: 1.5, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest meeting */}
        <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 16, gridColumn: "1 / -1", borderTop: `2px solid ${p.accent}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: p.text, fontSize: 14, fontWeight: 600 }}>Intro with Vic — Gymreapers</div>
              <div style={{ color: p.dim, fontSize: 11, marginTop: 2 }}>Today · 28min · 1:1</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {dims.map((d) => (
                <div key={d.name} style={{ background: `${p.border}60`, borderRadius: 6, padding: "6px 10px", textAlign: "center" }}>
                  <div style={{ color: scoreColor(d.score, p), fontSize: 16, fontWeight: 700 }}>{d.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DesignPage() {
  const [selected, setSelected] = useState<PaletteKey | null>(null);

  return (
    <div style={{ background: "#08080a", minHeight: "100vh", padding: "40px 48px" }}>
      <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>MeetingIQ — Pick Your Palette</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Click any option to see it larger. All use your real Vic meeting data.</p>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr" : "1fr 1fr 1fr", gap: 24 }}>
        {(Object.entries(palettes) as [PaletteKey, typeof palettes.A][])
          .filter(([key]) => !selected || selected === key)
          .map(([key, p]) => (
            <div key={key}>
              <div
                onClick={() => setSelected(selected === key ? null : key)}
                style={{ cursor: "pointer", transform: selected === key ? "scale(1)" : "scale(1)", transition: "all 0.3s ease" }}
              >
                <div style={{ marginBottom: 12, display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Option {key}</span>
                  <span style={{ color: p.accent, fontSize: 14, fontWeight: 600 }}>{p.name}</span>
                </div>
                <p style={{ color: "#777", fontSize: 12, marginBottom: 12 }}>{p.sub}</p>

                {/* Color swatches */}
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                  {[p.bg, p.surface, p.border, p.accent, p.accentLight, p.green, p.amber, p.red].map((c, i) => (
                    <div key={i} style={{ width: 24, height: 24, borderRadius: 6, background: c, border: "1px solid #333" }} />
                  ))}
                </div>

                <DemoCard paletteKey={key} p={p} />
              </div>

              {selected === key && (
                <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(null); }}
                    style={{ padding: "10px 24px", borderRadius: 8, background: "#222", color: "#aaa", border: "1px solid #333", cursor: "pointer", fontSize: 13 }}
                  >
                    ← Back to all
                  </button>
                  <button
                    style={{ padding: "10px 24px", borderRadius: 8, background: p.accent, color: p.bg, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
                  >
                    Choose {p.name}
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Logo concepts */}
      {!selected && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Logo Concepts</h2>
          <div style={{ display: "flex", gap: 32 }}>
            {(Object.entries(palettes) as [PaletteKey, typeof palettes.A][]).map(([key, p]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", background: p.bg, borderRadius: 12, border: `1px solid ${p.border}` }}>
                <Logo p={p} size={40} />
                <div>
                  <span style={{ color: p.text, fontSize: 20, fontWeight: 800 }}>Meeting<span style={{ color: p.accent }}>IQ</span></span>
                  <div style={{ color: p.dim, fontSize: 10, letterSpacing: 2, fontWeight: 600, marginTop: 2 }}>ESSAYONS</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
