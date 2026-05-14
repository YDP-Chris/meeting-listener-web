"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Meeting = { id: number; title: string; started_at: string; duration_seconds: number; meeting_type: string | null; summary: string | null; iq_score: number | null; headline: string | null };
type Insight = { id: number; insight: string; dimension: string; meeting_id: number };
type Milestone = { milestone_key: string; name: string; description: string; icon: string; earned_at: string | null; is_earned: boolean };
type Grade = { dimension: string; score: number };

function scoreColor(s: number) { return s >= 8 ? '#6bc77c' : s >= 6 ? '#d4a853' : '#e86b5a'; }

function IQRing({ score }: { score: number }) {
  const r = 58; const circ = 2 * Math.PI * r; const pct = score / 100;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#2a2a30" strokeWidth="6" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="#d4a853" strokeWidth="6"
        strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
        strokeLinecap="round" transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dasharray 1.5s ease" }} />
      <text x="70" y="66" textAnchor="middle" fill="#f0ece4" fontSize="38" fontWeight="800" fontFamily="Inter, sans-serif">{score}</text>
      <text x="70" y="86" textAnchor="middle" fill="#5e5a55" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="2">IQ SCORE</text>
    </svg>
  );
}

export default function CommandCenter() {
  const [latest, setLatest] = useState<Meeting | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [streak, setStreak] = useState(0);
  const [meetingCount, setMeetingCount] = useState(0);
  const [actionCount, setActionCount] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("ml_meetings").select("*").order("started_at", { ascending: false }).limit(1),
      supabase.from("ml_coaching_insights").select("*").order("priority").limit(3),
      supabase.from("ml_milestones").select("*").eq("is_earned", true).order("earned_at", { ascending: false }),
      supabase.from("ml_streaks").select("current_streak").limit(1),
      supabase.from("ml_meetings").select("id", { count: "exact", head: true }),
      supabase.from("ml_action_items").select("id", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("ml_people").select("id", { count: "exact", head: true }),
    ]).then(([meetingRes, insightRes, milestoneRes, streakRes, mcRes, acRes, pcRes]) => {
      const m = meetingRes.data?.[0] || null;
      setLatest(m);
      setInsights(insightRes.data || []);
      setMilestones(milestoneRes.data || []);
      setStreak(streakRes.data?.[0]?.current_streak || 0);
      setMeetingCount(mcRes.count || 0);
      setActionCount(acRes.count || 0);
      setPeopleCount(pcRes.count || 0);

      if (m) {
        supabase.from("ml_grades").select("dimension, score").eq("meeting_id", m.id)
          .then(({ data }) => { setGrades(data || []); setLoading(false); });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!latest) return (
    <div className="text-center py-32">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
          <rect x="12" y="4" width="8" height="14" rx="4" fill="#d4a853" />
          <path d="M8 16v2a8 8 0 0 0 16 0v-2" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <h2 className="text-xl font-bold">Welcome to MeetingIQ</h2>
      <p className="mt-2" style={{ color: '#5e5a55' }}>Record your first meeting to begin your communication journey.</p>
      <p className="mt-1 text-xs font-semibold tracking-[3px]" style={{ color: '#3a3a3e' }}>ESSAYONS</p>
    </div>
  );

  const dims = [...grades].sort((a, b) => b.score - a.score);
  const avgScore = grades.length ? Math.round(grades.reduce((a, g) => a + g.score, 0) / grades.length * 10) / 10 : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
        <p className="text-sm mt-1" style={{ color: '#5e5a55' }}>Your communication intelligence at a glance</p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-4">

        {/* IQ Hero — spans 8 cols */}
        <div className="col-span-12 lg:col-span-8 rounded-xl p-6 flex gap-8 items-center" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
          <div className="shrink-0">
            <IQRing score={latest.iq_score || 0} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1">Communication Intelligence</h2>
            <p className="text-xs mb-4" style={{ color: '#5e5a55' }}>{meetingCount} meeting{meetingCount !== 1 ? 's' : ''} analyzed</p>
            <div className="space-y-2.5">
              {dims.map((d) => (
                <div key={d.dimension} className="flex items-center gap-3">
                  <span className="text-xs w-28 capitalize" style={{ color: '#6e6a65' }}>{d.dimension.replace(/_/g, ' ')}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#2a2a30' }}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.score * 10}%`, background: scoreColor(d.score) }} />
                  </div>
                  <span className="text-xs font-bold w-6 text-right" style={{ color: scoreColor(d.score) }}>{d.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Streak + Stats — spans 4 cols */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          {/* Streak */}
          <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
            <span className="text-3xl">🔥</span>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{streak}</span>
                <span className="text-sm" style={{ color: '#6e6a65' }}>streak</span>
              </div>
              <p className="text-xs mt-1" style={{ color: '#5e5a55' }}>Keep building momentum</p>
            </div>
          </div>

          {/* Quick Stats 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { v: meetingCount, l: "MEETINGS", c: "#d4a853" },
              { v: actionCount, l: "ACTIONS", c: "#e86b5a" },
              { v: peopleCount, l: "PEOPLE", c: "#6bc77c" },
              { v: avgScore, l: "AVG SCORE", c: "#f0ece4" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl p-4" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
                <div className="text-2xl font-bold" style={{ color: s.c }}>{s.v}</div>
                <div className="text-[9px] font-semibold tracking-[1.5px] mt-1" style={{ color: '#5e5a55' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Coaching Insight — spans 6 cols */}
        <div className="col-span-12 lg:col-span-6 rounded-xl p-5 relative overflow-hidden" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
          <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full" style={{ background: '#d4a853' }} />
          <div className="pl-4">
            <div className="text-[10px] font-semibold tracking-[1.5px] mb-2" style={{ color: '#d4a853' }}>COACHING</div>
            {insights[0] && (
              <>
                <p className="text-sm leading-relaxed" style={{ color: '#9a9590' }}>{insights[0].insight}</p>
                <p className="text-[11px] mt-3" style={{ color: '#3a3a3e' }}>Dimension: {insights[0].dimension?.replace(/_/g, ' ')}</p>
              </>
            )}
          </div>
        </div>

        {/* Milestones — spans 6 cols */}
        <div className="col-span-12 lg:col-span-6 rounded-xl p-5" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
          <div className="text-[10px] font-semibold tracking-[1.5px] mb-3" style={{ color: '#d4a853' }}>MILESTONES EARNED</div>
          <div className="flex flex-wrap gap-3">
            {milestones.map((m) => (
              <div key={m.milestone_key} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#222225', border: '1px solid #2a2a30' }}>
                <span className="text-lg">{m.icon}</span>
                <div>
                  <div className="text-xs font-semibold">{m.name}</div>
                  <div className="text-[10px]" style={{ color: '#5e5a55' }}>{m.description}</div>
                </div>
              </div>
            ))}
            {milestones.length === 0 && <p className="text-xs" style={{ color: '#5e5a55' }}>Complete meetings to earn badges</p>}
          </div>
        </div>

        {/* Latest Meeting — full width */}
        <Link href={`/meetings/${latest.id}`} className="col-span-12 rounded-xl p-5 transition-all hover:translate-y-[-1px] block"
          style={{ background: '#1a1a1e', border: '1px solid #2a2a30', borderTop: '2px solid #d4a853' }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[9px] font-semibold tracking-[2px] mb-1" style={{ color: '#d4a853' }}>LATEST MEETING</div>
              <div className="text-base font-semibold">{latest.title}</div>
              <div className="text-xs mt-1" style={{ color: '#5e5a55' }}>
                {new Date(latest.started_at).toLocaleString()} · {Math.round((latest.duration_seconds || 0) / 60)}min
                {latest.meeting_type && ` · ${latest.meeting_type}`}
              </div>
              {latest.headline && <p className="text-sm mt-2 italic" style={{ color: '#6e6a65' }}>"{latest.headline}"</p>}
            </div>
            <div className="flex gap-2">
              {dims.slice(0, 6).map((d) => (
                <div key={d.dimension} className="text-center px-2 py-1.5 rounded-lg" style={{ background: '#222225' }}>
                  <div className="text-lg font-bold" style={{ color: scoreColor(d.score) }}>{d.score}</div>
                  <div className="text-[8px] capitalize" style={{ color: '#5e5a55' }}>{d.dimension.replace(/_/g, ' ').slice(0, 7)}</div>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
