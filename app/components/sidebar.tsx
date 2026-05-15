"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const links = [
  { href: "/", label: "Home", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { href: "/meetings", label: "Meetings", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )},
  { href: "/action-items", label: "Actions", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  )},
  { href: "/people", label: "People", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )},
  { href: "/dashboard", label: "Dashboard", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )},
  { href: "/coaching", label: "Coaching", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )},
  { href: "/intelligence", label: "Intelligence", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )},
];

function IQRing({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const pct = score / 100;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#2a2a30" strokeWidth="4" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="#d4a853" strokeWidth="4"
        strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
        strokeLinecap="round" transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 1s ease" }} />
      <text x="36" y="34" textAnchor="middle" fill="#f0ece4" fontSize="18" fontWeight="800" fontFamily="Inter, sans-serif">{score}</text>
      <text x="36" y="46" textAnchor="middle" fill="#5e5a55" fontSize="7" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="1.5">IQ</text>
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [iqScore, setIqScore] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Get latest IQ score
    supabase.from("ml_meetings").select("iq_score").order("started_at", { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]?.iq_score) setIqScore(data[0].iq_score); });
    // Get streak
    supabase.from("ml_streaks").select("current_streak").limit(1)
      .then(({ data }) => { if (data?.[0]) setStreak(data[0].current_streak); });
  }, []);

  if (pathname === "/design") return null; // Hide on design picker page

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2.5 lg:hidden"
        style={{ background: '#141416', borderBottom: '1px solid #2a2a30' }}>
        <div className="flex items-center gap-2.5">
          <img src="/icon.png" alt="MeetingIQ" width={24} height={24} className="rounded-md" />
          <span className="text-sm font-bold" style={{ color: '#f0ece4' }}>
            Meeting<span style={{ color: '#d4a853' }}>IQ</span>
          </span>
        </div>
        <button className="p-1.5 rounded-lg" style={{ background: '#1a1a1e' }}
          onClick={() => setCollapsed(!collapsed)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0ece4" strokeWidth="2">
            {collapsed
              ? <path d="M18 6L6 18M6 6l12 12"/>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${collapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: 220, background: '#141416', borderRight: '1px solid #2a2a30' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-2.5">
          <img src="/icon.png" alt="MeetingIQ" width={28} height={28} className="rounded-md" />
          <span className="text-base font-bold" style={{ color: '#f0ece4' }}>
            Meeting<span style={{ color: '#d4a853' }}>IQ</span>
          </span>
        </div>

        {/* IQ Score Widget */}
        {iqScore !== null && (
          <div className="mx-4 mb-4 p-3 rounded-xl text-center" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
            <IQRing score={iqScore} />
            {streak > 0 && (
              <div className="flex items-center justify-center gap-1 mt-2 text-xs" style={{ color: '#d4a853' }}>
                🔥 {streak} streak
              </div>
            )}
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-0.5">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setCollapsed(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative"
                style={{
                  color: active ? '#f0ece4' : '#6e6a65',
                  background: active ? '#222225' : 'transparent',
                }}
              >
                {active && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full" style={{ background: '#d4a853' }} />
                )}
                <span style={{ color: active ? '#d4a853' : '#6e6a65' }}>{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid #2a2a30' }}>
          <p className="text-[10px] font-semibold tracking-[3px]" style={{ color: '#3a3a3e' }}>ESSAYONS</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {collapsed && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setCollapsed(false)} />
      )}
    </>
  );
}
