"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { use } from "react";

type Grade = { dimension: string; score: number; reasoning: string };

function scoreColor(s: number) {
  if (s >= 8) return '#06d6a0';
  if (s >= 5) return '#f59e0b';
  return '#ef4444';
}

export default function MeetingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [meeting, setMeeting] = useState<any>(null);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    supabase.from("ml_meetings").select("*").eq("id", id).single().then(({ data }) => setMeeting(data));
    supabase.from("ml_grades").select("*").eq("meeting_id", id).order("dimension").then(({ data }) => setGrades(data || []));
  }, [id]);

  if (!meeting) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-1 text-sm mb-6 transition-colors" style={{ color: '#64748b' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#818cf8')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to meetings
      </Link>

      <div className="flex justify-between items-start mb-1">
        <h1 className="text-2xl font-bold tracking-tight">{meeting.title}</h1>
        {meeting.meeting_type && (
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#6366f120', color: '#818cf8' }}>{meeting.meeting_type}</span>
        )}
      </div>
      <p className="text-xs mb-8" style={{ color: '#64748b' }}>
        {new Date(meeting.started_at).toLocaleString()} · {Math.round((meeting.duration_seconds || 0) / 60)}min
      </p>

      {meeting.summary && (
        <Section title="Summary">
          <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>{meeting.summary}</p>
        </Section>
      )}

      {meeting.decisions?.length > 0 && (
        <Section title="Decisions">
          <div className="space-y-2">
            {meeting.decisions.map((d: any, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: '#06d6a020' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06d6a0" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{d.decision}</p>
                  <p className="text-xs" style={{ color: '#64748b' }}>{d.made_by}{d.context ? ` — ${d.context}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {meeting.discussion_threads?.length > 0 && (
        <Section title="Discussion Threads">
          <div className="space-y-4">
            {meeting.discussion_threads.map((t: any, i: number) => (
              <div key={i} className="rounded-lg p-4" style={{ background: '#0a0b14', border: '1px solid #1e293b' }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#818cf8' }}>{t.topic}</h3>
                <ul className="space-y-1">
                  {t.key_points?.map((p: string, j: number) => (
                    <li key={j} className="text-sm flex items-start gap-2" style={{ color: '#94a3b8' }}>
                      <span style={{ color: '#6366f1' }}>·</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {grades.length > 0 && (
        <Section title="Communication Grades">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {grades.map((g) => (
              <div key={g.dimension} className="rounded-xl p-4 text-center" style={{ background: '#111827', border: '1px solid #1e293b' }}>
                <div className="text-3xl font-bold" style={{ color: scoreColor(g.score) }}>{g.score}</div>
                <div className="text-[11px] uppercase tracking-wider mt-1 font-medium" style={{ color: '#64748b' }}>{g.dimension.replace(/_/g, " ")}</div>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: '#475569' }}>{g.reasoning}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {meeting.transcript && (
        <Section title="Transcript">
          <pre className="text-xs p-4 rounded-xl overflow-auto max-h-96 whitespace-pre-wrap leading-relaxed" style={{ background: '#0a0b14', color: '#64748b', border: '1px solid #1e293b' }}>
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
      <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>{title}</h2>
      {children}
    </section>
  );
}
