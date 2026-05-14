"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { use } from "react";

export default function PersonDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [person, setPerson] = useState<any>(null);
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("ml_people").select("*").eq("id", id).single().then(({ data }) => setPerson(data));
    supabase.from("ml_participants").select("meeting_id").eq("person_id", id).then(async ({ data }) => {
      if (!data?.length) return;
      const ids = data.map((d) => d.meeting_id);
      const { data: mtgs } = await supabase.from("ml_meetings").select("id, title, started_at").in("id", ids).order("started_at", { ascending: false });
      setMeetings(mtgs || []);
    });
  }, [id]);

  if (!person) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} /></div>;

  const style = person.communication_style || {};
  const triggers = person.triggers || {};

  return (
    <div>
      <Link href="/people" className="inline-flex items-center gap-1 text-sm mb-6 transition-colors" style={{ color: '#5e5a55' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#e8c171')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#5e5a55')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to people
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: '#d4a85320', color: '#e8c171' }}>
          {person.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{person.name}</h1>
          <p className="text-xs" style={{ color: '#5e5a55' }}>
            Since {person.first_seen ? new Date(person.first_seen).toLocaleDateString() : "N/A"}
            {person.rapport_score != null && ` · Rapport: ${person.rapport_score}/10 (${person.rapport_trend || "unknown"})`}
          </p>
        </div>
      </div>

      {Object.keys(style).length > 0 && (
        <Section title="Communication Style">
          <div className="space-y-3 mb-3">
            {style.directness != null && <Bar label="Directness" value={style.directness} />}
            {style.formality != null && <Bar label="Formality" value={style.formality} />}
          </div>
          <div className="flex gap-4 text-sm mb-3" style={{ color: '#9a9590' }}>
            {style.pace && <span>Pace: <strong className="capitalize">{style.pace}</strong></span>}
            {style.preferred_format && <span>Format: <strong className="capitalize">{style.preferred_format}</strong></span>}
          </div>
          {style.summary && <p className="text-sm italic leading-relaxed" style={{ color: '#9a9590' }}>{style.summary}</p>}
        </Section>
      )}

      {triggers.positive_triggers?.length > 0 && (
        <Section title="Responds Well To">
          <div className="space-y-2">
            {triggers.positive_triggers.map((t: any, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span style={{ color: '#6bc77c' }}>+</span>
                <div>
                  <span style={{ color: '#d5d0c8' }}>{t.trigger}</span>
                  {t.context && <p className="text-xs mt-0.5" style={{ color: '#5e5a55' }}>{t.context}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {triggers.negative_triggers?.length > 0 && (
        <Section title="Sensitive To">
          <div className="space-y-2">
            {triggers.negative_triggers.map((t: any, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span style={{ color: '#e86b5a' }}>-</span>
                <div>
                  <span style={{ color: '#d5d0c8' }}>{t.trigger}</span>
                  {t.context && <p className="text-xs mt-0.5" style={{ color: '#5e5a55' }}>{t.context}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {meetings.length > 0 && (
        <Section title="Interaction History">
          <div className="space-y-2">
            {meetings.map((m: any) => (
              <Link key={m.id} href={`/meetings/${m.id}`}
                className="flex items-center justify-between rounded-lg p-3 transition-all"
                style={{ background: '#111113', border: '1px solid #2a2a30' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d4a853')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a30')}>
                <span className="text-sm">{m.title}</span>
                <span className="text-xs" style={{ color: '#5e5a55' }}>{m.started_at ? new Date(m.started_at).toLocaleDateString() : ""}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#d4a853' }}>{title}</h2>
      {children}
    </section>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24" style={{ color: '#5e5a55' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#2a2a30' }}>
        <div className="h-full rounded-full" style={{ width: `${value * 10}%`, background: 'linear-gradient(90deg, #d4a853, #6bc77c)' }} />
      </div>
      <span className="w-10 text-right" style={{ color: '#9a9590' }}>{value}/10</span>
    </div>
  );
}
