"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { use } from "react";
import { RadarChart } from "@/app/components/radar-chart";

type Grade = { dimension: string; score: number; reasoning: string; evidence?: string[] };
type KeyMoment = { dimension: string; moment_type: string; transcript_excerpt: string; explanation: string };

function scoreColor(s: number) { return s >= 8 ? '#6bc77c' : s >= 5 ? '#d4a853' : '#e86b5a'; }

export default function MeetingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [meeting, setMeeting] = useState<any>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [moments, setMoments] = useState<KeyMoment[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("ml_meetings").select("*").eq("id", id).single().then(({ data }) => setMeeting(data));
    supabase.from("ml_grades").select("*").eq("meeting_id", id).order("dimension").then(({ data }) => setGrades(data || []));
    supabase.from("ml_key_moments").select("*").eq("meeting_id", id).then(({ data }) => setMoments(data || []));
    supabase.from("ml_coaching_insights").select("*").eq("meeting_id", id).order("priority").then(({ data }) => setInsights(data || []));
  }, [id]);

  if (!meeting) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} />
    </div>
  );

  const dims = grades.map(g => ({ name: g.dimension.replace(/_/g, ' '), score: g.score }));

  return (
    <div>
      <Link href="/meetings" className="inline-flex items-center gap-1 text-sm mb-6 transition-colors" style={{ color: '#5e5a55' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#e8c171')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#5e5a55')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to meetings
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <h1 className="text-2xl font-bold tracking-tight">{meeting.title}</h1>
        <div className="flex items-center gap-3">
          {meeting.meeting_type && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#d4a85320', color: '#e8c171' }}>{meeting.meeting_type}</span>
          )}
          {meeting.iq_score && (
            <div className="text-center px-3 py-1 rounded-lg" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
              <span className="text-lg font-bold" style={{ color: '#d4a853' }}>{meeting.iq_score}</span>
              <span className="text-[9px] ml-1" style={{ color: '#5e5a55' }}>IQ</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs mb-8" style={{ color: '#5e5a55' }}>
        {new Date(meeting.started_at).toLocaleString()} · {Math.round((meeting.duration_seconds || 0) / 60)}min
      </p>

      {/* Radar + Grades Grid */}
      {grades.length > 0 && (
        <div className="grid grid-cols-12 gap-4 mb-8">
          {/* Radar Chart */}
          <div className="col-span-12 lg:col-span-5 rounded-xl p-6 flex items-center justify-center" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
            <RadarChart dimensions={dims} />
          </div>

          {/* Grade Cards */}
          <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-3">
            {grades.map((g) => {
              const dimMoments = moments.filter(m => m.dimension === g.dimension);
              const isExpanded = expandedDim === g.dimension;
              return (
                <div key={g.dimension}
                  className="rounded-xl p-4 cursor-pointer transition-all"
                  style={{ background: '#1a1a1e', border: `1px solid ${isExpanded ? '#d4a853' : '#2a2a30'}` }}
                  onClick={() => setExpandedDim(isExpanded ? null : g.dimension)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-medium capitalize" style={{ color: '#6e6a65' }}>{g.dimension.replace(/_/g, ' ')}</span>
                    <span className="text-2xl font-bold" style={{ color: scoreColor(g.score) }}>{g.score}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#5e5a55' }}>{g.reasoning}</p>
                  {isExpanded && dimMoments.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid #2a2a30' }}>
                      <div className="text-[9px] font-semibold tracking-[1.5px] mb-2" style={{ color: '#d4a853' }}>KEY MOMENTS</div>
                      {dimMoments.map((m, i) => (
                        <div key={i} className="mb-2 text-xs pl-3" style={{ borderLeft: `2px solid ${m.moment_type === 'positive' ? '#6bc77c' : '#e86b5a'}` }}>
                          <p className="italic" style={{ color: '#9a9590' }}>"{m.transcript_excerpt}"</p>
                          <p className="mt-1" style={{ color: '#5e5a55' }}>{m.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Coaching Cards */}
      {insights.length > 0 && (
        <Section title="Coaching">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {insights.map((ins, i) => (
              <div key={i} className="rounded-xl p-4 relative overflow-hidden" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
                <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full" style={{ background: '#d4a853' }} />
                <div className="pl-3">
                  <div className="text-[9px] font-semibold tracking-[1px] mb-1 capitalize" style={{ color: '#d4a853' }}>{ins.dimension?.replace(/_/g, ' ')}</div>
                  <p className="text-xs leading-relaxed" style={{ color: '#9a9590' }}>{ins.insight}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Summary */}
      {meeting.summary && (
        <Section title="Summary">
          <p className="text-sm leading-relaxed" style={{ color: '#d5d0c8' }}>{meeting.summary}</p>
        </Section>
      )}

      {/* Decisions */}
      {meeting.decisions?.length > 0 && (
        <Section title="Decisions">
          <div className="space-y-2">
            {meeting.decisions.map((d: any, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: '#6bc77c20' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6bc77c" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{d.decision}</p>
                  <p className="text-xs" style={{ color: '#5e5a55' }}>{d.made_by}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Discussion Threads */}
      {meeting.discussion_threads?.length > 0 && (
        <Section title="Discussion Threads">
          <div className="space-y-3">
            {meeting.discussion_threads.map((t: any, i: number) => (
              <div key={i} className="rounded-lg p-4" style={{ background: '#141416', border: '1px solid #2a2a30' }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#e8c171' }}>{t.topic}</h3>
                <ul className="space-y-1">
                  {t.key_points?.map((p: string, j: number) => (
                    <li key={j} className="text-sm flex items-start gap-2" style={{ color: '#9a9590' }}>
                      <span style={{ color: '#d4a853' }}>·</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Transcript */}
      {meeting.transcript && (
        <Section title="Transcript">
          <pre className="text-xs p-4 rounded-xl overflow-auto max-h-96 whitespace-pre-wrap leading-relaxed" style={{ background: '#141416', color: '#5e5a55', border: '1px solid #2a2a30' }}>
            {meeting.transcript}
          </pre>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#d4a853' }}>{title}</h2>
      {children}
    </section>
  );
}
