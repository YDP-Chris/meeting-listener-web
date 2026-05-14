"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { use } from "react";

function rapportColor(s: number) { return s >= 7 ? '#6bc77c' : s >= 4 ? '#d4a853' : '#e86b5a'; }

export default function PersonDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [person, setPerson] = useState<any>(null);
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("ml_people").select("*").eq("id", id).single().then(({ data }) => setPerson(data));
    supabase.from("ml_participants").select("meeting_id").eq("person_id", id).then(async ({ data }) => {
      if (!data?.length) return;
      const ids = data.map((d) => d.meeting_id);
      const { data: mtgs } = await supabase.from("ml_meetings").select("id, title, started_at, iq_score").in("id", ids).order("started_at", { ascending: false });
      setMeetings(mtgs || []);
    });
  }, [id]);

  if (!person) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} /></div>;

  const style = person.communication_style || {};
  const triggers = person.triggers || {};
  const prefs = Array.isArray(person.preferences) ? person.preferences : [];

  return (
    <div>
      <Link href="/people" className="inline-flex items-center gap-1 text-sm mb-6 transition-colors" style={{ color: '#5e5a55' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#e8c171')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#5e5a55')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to people
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: '#d4a85320', color: '#e8c171' }}>
          {person.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{person.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs" style={{ color: '#5e5a55' }}>Since {person.first_seen ? new Date(person.first_seen).toLocaleDateString() : "N/A"}</span>
            {person.rapport_score != null && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: rapportColor(person.rapport_score) + '20', color: rapportColor(person.rapport_score) }}>
                Rapport: {person.rapport_score}/10 · {person.rapport_trend}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Playbook — DO / AVOID / STYLE / PREP */}
        <div className="col-span-12 lg:col-span-7">
          <Section title="Playbook — How to work with them">
            <div className="grid grid-cols-2 gap-3">
              {/* DO */}
              <div className="rounded-xl p-4" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#6bc77c20', color: '#6bc77c' }}>✓</div>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6bc77c' }}>Do</span>
                </div>
                {triggers.positive_triggers?.length > 0 ? (
                  <ul className="space-y-2">
                    {triggers.positive_triggers.map((t: any, i: number) => (
                      <li key={i} className="text-xs leading-relaxed" style={{ color: '#9a9590' }}>{t.trigger}</li>
                    ))}
                  </ul>
                ) : <p className="text-xs" style={{ color: '#5e5a55' }}>More meetings needed</p>}
              </div>

              {/* AVOID */}
              <div className="rounded-xl p-4" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#e86b5a20', color: '#e86b5a' }}>✕</div>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#e86b5a' }}>Avoid</span>
                </div>
                {triggers.negative_triggers?.length > 0 ? (
                  <ul className="space-y-2">
                    {triggers.negative_triggers.map((t: any, i: number) => (
                      <li key={i} className="text-xs leading-relaxed" style={{ color: '#9a9590' }}>{t.trigger}</li>
                    ))}
                  </ul>
                ) : <p className="text-xs" style={{ color: '#5e5a55' }}>More meetings needed</p>}
              </div>

              {/* STYLE */}
              <div className="rounded-xl p-4" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#d4a853' }}>Style</div>
                <div className="space-y-2">
                  {style.directness != null && <Bar label="Directness" value={style.directness} />}
                  {style.formality != null && <Bar label="Formality" value={style.formality} />}
                  {style.pace && <div className="text-xs" style={{ color: '#6e6a65' }}>Pace: <strong className="capitalize" style={{ color: '#9a9590' }}>{style.pace}</strong></div>}
                  {style.preferred_format && <div className="text-xs" style={{ color: '#6e6a65' }}>Format: <strong className="capitalize" style={{ color: '#9a9590' }}>{style.preferred_format}</strong></div>}
                </div>
              </div>

              {/* PREP */}
              <div className="rounded-xl p-4" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#d4a853' }}>Prep Tips</div>
                {prefs.length > 0 ? (
                  <ul className="space-y-2">
                    {prefs.slice(0, 4).map((p: string, i: number) => (
                      <li key={i} className="text-xs leading-relaxed flex items-start gap-1.5" style={{ color: '#9a9590' }}>
                        <span style={{ color: '#d4a853' }}>→</span> {typeof p === 'string' ? p : (p as any).trigger || ''}
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-xs" style={{ color: '#5e5a55' }}>More meetings needed</p>}
              </div>
            </div>
          </Section>
        </div>

        {/* Right column: Summary + Heatmap */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          {/* Style summary */}
          {style.summary && (
            <div className="rounded-xl p-5" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#d4a853' }}>Communication Summary</div>
              <p className="text-sm italic leading-relaxed" style={{ color: '#9a9590' }}>{style.summary}</p>
            </div>
          )}

          {/* Interaction Heatmap */}
          <div className="rounded-xl p-5" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#d4a853' }}>Interaction Frequency</div>
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 12 }, (_, weekIdx) => {
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - (11 - weekIdx) * 7);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 7);
                const count = meetings.filter(m => {
                  const d = new Date(m.started_at);
                  return d >= weekStart && d < weekEnd;
                }).length;
                const opacity = count === 0 ? 0.1 : Math.min(1, count * 0.35 + 0.2);
                return (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }, (_, dayIdx) => (
                      <div key={dayIdx} className="w-3 h-3 rounded-sm"
                        style={{ background: count > 0 && dayIdx < count ? `rgba(212, 168, 83, ${opacity})` : '#222225' }}
                        title={`Week of ${weekStart.toLocaleDateString()}: ${count} meeting${count !== 1 ? 's' : ''}`} />
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[10px]" style={{ color: '#5e5a55' }}>
              <span>Less</span>
              {[0.1, 0.3, 0.5, 0.8, 1].map((o, i) => (
                <div key={i} className="w-3 h-3 rounded-sm" style={{ background: `rgba(212, 168, 83, ${o})` }} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Interaction History — full width */}
        {meetings.length > 0 && (
          <div className="col-span-12">
            <Section title="Interaction History">
              <div className="space-y-2">
                {meetings.map((m: any) => (
                  <Link key={m.id} href={`/meetings/${m.id}`}
                    className="flex items-center justify-between rounded-lg p-3 transition-all"
                    style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d4a853')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a30')}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{m.title}</span>
                      {m.iq_score && <span className="text-xs font-bold" style={{ color: '#d4a853' }}>{m.iq_score} IQ</span>}
                    </div>
                    <span className="text-xs" style={{ color: '#5e5a55' }}>{m.started_at ? new Date(m.started_at).toLocaleDateString() : ""}</span>
                  </Link>
                ))}
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#d4a853' }}>{title}</h2>
      {children}
    </section>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20" style={{ color: '#5e5a55' }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#2a2a30' }}>
        <div className="h-full rounded-full" style={{ width: `${value * 10}%`, background: 'linear-gradient(90deg, #d4a853, #6bc77c)' }} />
      </div>
      <span className="w-8 text-right" style={{ color: '#9a9590' }}>{value}</span>
    </div>
  );
}
